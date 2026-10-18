// pages/RemoteScannerPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  ScanLine, RefreshCw, Check, Wifi, WifiOff,
  Camera, Image as ImageIcon, FileText, Package
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

const WS_BASE = (() => {
  const api = process.env.REACT_APP_API_URL || window.location.origin;
  const proto = api.startsWith("https") ? "wss" : "ws";
  const host = api.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `${proto}://${host}`;
})();

// ৪টা mode
const MODES = [
  { id: "barcode", label: "Barcode/QR", icon: ScanLine, color: "emerald" },
  { id: "pack_ocr", label: "Pack Photo", icon: Package, color: "orange" },
  { id: "payment_proof", label: "Payment", icon: FileText, color: "blue" },
  { id: "general_image", label: "General", icon: ImageIcon, color: "purple" },
];

const RemoteScannerPage = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const initialMode = params.get("mode") || "barcode";

  const wsRef = useRef(null);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const regionId = "remote-scanner-region";

  const [connected, setConnected] = useState(false);
  const [mode, setMode] = useState(initialMode);
  const [facing, setFacing] = useState("environment");
  const [lastSent, setLastSent] = useState(null);
  const [error, setError] = useState("");
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  /* ── WebSocket ── */
  useEffect(() => {
    if (!token) {
      setError("Invalid pairing link (no token).");
      return;
    }
    const ws = new WebSocket(`${WS_BASE}/ws/scanner/${token}/`);
    wsRef.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "connected") setConnected(true);
        if (msg.type === "ack") {
          // server confirmed
        }
      } catch {}
    };
    return () => { try { ws.close(); } catch {} };
  }, [token]);

  /* ── Barcode scanner ── */
  const stopScanner = async () => {
    try {
      const s = scannerRef.current;
      if (s) {
        const st = s.getState?.();
        if (st === 2 || st === 3) await s.stop();
        s.clear?.();
      }
    } catch {}
    scannerRef.current = null;
  };

  const startScanner = async () => {
    setError("");
    await new Promise((r) => setTimeout(r, 100));
    try {
      const scanner = new Html5Qrcode(regionId, false);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: facing },
        { fps: 10, qrbox: { width: 260, height: 180 }, aspectRatio: 1.777 },
        (decodedText) => {
          if (navigator.vibrate) navigator.vibrate(80);
          sendScan({ kind: "barcode", code: decodedText });
        },
        () => {}
      );

      try {
        const caps = scanner.getRunningTrackCapabilities?.() || {};
        setTorchSupported(!!caps.torch);
      } catch {}
    } catch (err) {
      console.error(err);
      setError("Camera চালু করা যাচ্ছে না। Permission দিন।");
    }
  };

  // Mode change → barcode হলে scanner, অন্য mode হলে বন্ধ
  useEffect(() => {
    if (mode === "barcode") {
      startScanner();
    } else {
      stopScanner();
    }
    return () => { stopScanner(); };
    // eslint-disable-next-line
  }, [facing, mode]);

  /* ── Torch ── */
  const toggleTorch = async () => {
    try {
      await scannerRef.current?.applyVideoConstraints?.({
        advanced: [{ torch: !torchOn }],
      });
      setTorchOn((t) => !t);
    } catch {}
  };

  /* ── Send ── */
  const sendScan = (payload) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setError("Connection নেই — আবার connect করুন");
      return;
    }
    ws.send(
      JSON.stringify({
        type: "scan",
        source: "mobile",
        purpose: mode,
        ...payload,
        ts: Date.now(),
      })
    );
    setLastSent({ ...payload, purpose: mode });
  };

  /* ── Image handling (all purposes except barcode) ── */
  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = mode === "pack_ocr" ? 1600 : 1200;
        let w = img.width;
        let h = img.height;
        if (w > MAX) {
          h = (h * MAX) / w;
          w = MAX;
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const quality = mode === "pack_ocr" ? 0.92 : 0.85;
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        sendScan({ kind: "image", image: dataUrl });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /* ── Camera capture for image modes ── */
  const openCameraCapture = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ScanLine size={18} className="text-emerald-400" />
          <p className="font-black uppercase text-xs tracking-widest">
            Remote Scanner
          </p>
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${
          connected ? "text-emerald-400" : "text-rose-400"
        }`}>
          {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {connected ? "Connected" : "Offline"}
        </div>
      </div>

      {/* Mode selector */}
      <div className="p-3 border-b border-white/10 grid grid-cols-4 gap-2">
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                active
                  ? `bg-${m.color}-600/30 border-2 border-${m.color}-400`
                  : "bg-white/5 border-2 border-transparent hover:bg-white/10"
              }`}
            >
              <Icon size={16} className={active ? `text-${m.color}-400` : "text-white/60"} />
              <span className="text-[9px] font-black uppercase tracking-wider">
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scanner / Image view */}
      {mode === "barcode" ? (
        <div className="relative flex-1">
          <div id={regionId} className="w-full aspect-[4/3] bg-black" />
          {!error && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-[80%] h-[45%] border-2 border-emerald-400/80 rounded-2xl">
                <span className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl" />
                <span className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl" />
                <span className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl" />
                <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl" />
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-emerald-400/70 animate-pulse" />
              </div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center">
              <p className="text-rose-400 text-xs font-bold">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
          {/* Info card */}
          <div className="w-full max-w-sm bg-white/5 rounded-2xl p-5 border border-white/10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
              <Camera size={28} className="text-emerald-400" />
            </div>
            <p className="font-black uppercase text-xs tracking-widest text-emerald-400">
              {MODES.find((m) => m.id === mode)?.label} Mode
            </p>
            <p className="text-[11px] text-white/60 leading-relaxed">
              {mode === "pack_ocr" &&
                "Medicine pack-এর MFG/EXP/Batch সংখ্যা পরিষ্কারভাবে দেখাও। Photo তোলার পর computer-এ auto-fill হবে।"}
              {mode === "payment_proof" &&
                "Payment slip / receipt-এর পরিষ্কার ছবি তুলো। Computer-এর payment modal-এ auto-set হবে।"}
              {mode === "general_image" &&
                "যেকোনো ছবি — computer-এ শেষ expiry product-এ OCR চালাবে।"}
            </p>
          </div>

          <button
            onClick={openCameraCapture}
            className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black text-sm uppercase tracking-widest shadow-2xl flex items-center gap-2 active:scale-95 transition"
          >
            <Camera size={20} /> Take / Choose Photo
          </button>
        </div>
      )}

      {/* Hidden camera input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture={mode === "pack_ocr" ? "environment" : undefined}
        className="hidden"
        onChange={handlePhoto}
      />

      {/* Last sent */}
      {lastSent && (
        <div className="mx-4 mt-3 bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-3 text-xs">
          <p className="text-emerald-400 font-black uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
            <Check size={12} /> Last sent — {lastSent.purpose}
          </p>
          <p className="font-mono break-all text-white/80">
            {lastSent.kind === "barcode"
              ? lastSent.code
              : `[${lastSent.kind} sent]`}
          </p>
        </div>
      )}

      {/* Controls */}
      {mode === "barcode" && (
        <div className="p-4 flex items-center justify-center gap-3 border-t border-white/10">
          <button
            onClick={() =>
              setFacing((f) => (f === "environment" ? "user" : "environment"))
            }
            className="p-3 rounded-full bg-white/10 hover:bg-white/20"
          >
            <RefreshCw size={18} />
          </button>
          {torchSupported && (
            <button
              onClick={toggleTorch}
              className={`p-3 rounded-full ${
                torchOn ? "bg-amber-500" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <Camera size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RemoteScannerPage;