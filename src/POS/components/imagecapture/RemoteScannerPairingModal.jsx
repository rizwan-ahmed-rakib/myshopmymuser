// components/RemoteScannerPairingModal.jsx
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import {
  Smartphone, X, Wifi, WifiOff, CheckCircle2,
  RefreshCw, ScanLine, Package, FileText, Image as ImageIcon,
} from "lucide-react";

const WS_BASE = (() => {
  const api = process.env.REACT_APP_API_URL || window.location.origin;
  const proto = api.startsWith("https") ? "wss" : "ws";
  const host = api.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `${proto}://${host}`;
})();

const generateToken = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

const DEFAULT_MODES = ["barcode", "pack_ocr", "payment_proof", "general_image"];

const RemoteScannerPairingModal = ({
  isOpen,
  onClose,
  onScan,
  /** কোন কোন mode চালু থাকবে */
  enabledModes = DEFAULT_MODES,
}) => {
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const t = generateToken();
    setToken(t);
    setConnected(false);
    setLastScan(null);

    const ws = new WebSocket(`${WS_BASE}/ws/scanner/${t}/`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "scan" && msg.source === "mobile") {
          setLastScan(msg);
          onScan?.(msg);
          // ack back
          try {
            ws.send(JSON.stringify({ type: "ack", ts: Date.now() }));
          } catch {}
        }
      } catch {}
    };

    return () => { try { ws.close(); } catch {} };
  }, [isOpen, onScan]);

  const baseUrl = window.location.origin;

  const scanUrl = token ? `${baseUrl}/remote-scan?token=${token}` : "";
  // Default mode — barcode হবে initial
  const qrValue = token
    ? `${baseUrl}/remote-scan?token=${token}&mode=${enabledModes[0]}`
    : "";

  const refresh = () => {
    try { wsRef.current?.close(); } catch {}
    const t = generateToken();
    setToken(t);
    setConnected(false);
    setLastScan(null);

    const ws = new WebSocket(`${WS_BASE}/ws/scanner/${t}/`);
    wsRef.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "scan" && msg.source === "mobile") {
          setLastScan(msg);
          onScan?.(msg);
        }
      } catch {}
    };
  };

  const purposeLabel = (p) => {
    switch (p) {
      case "barcode": return "Barcode/QR";
      case "pack_ocr": return "Pack OCR";
      case "payment_proof": return "Payment Proof";
      case "general_image": return "General Image";
      default: return p;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Smartphone size={18} className="text-blue-600" />
            <p className="font-black uppercase text-xs tracking-widest text-gray-800">
              Pair Mobile Scanner
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Status */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
            connected
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}>
            {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
            {connected ? "Listening for mobile…" : "Waiting for connection…"}
          </div>

          {/* QR */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200">
              {qrValue && <QRCode value={qrValue} size={200} />}
            </div>
            <p className="text-center text-[11px] text-gray-500 font-semibold leading-relaxed">
              📱 Mobile-এর camera দিয়ে QR scan করো — অথবা link খোলো:
            </p>
            <code className="text-[10px] bg-gray-100 px-2 py-1 rounded font-mono text-gray-700 break-all text-center">
              {scanUrl}
            </code>
          </div>

          {/* Supported purposes */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3 text-[11px] text-blue-900 space-y-1.5">
            <p className="font-black uppercase text-[10px] tracking-wider mb-1">
              Mobile থেকে কী কী পাঠানো যাবে
            </p>
            {enabledModes.map((p, i) => (
              <div key={p} className="flex items-center gap-2">
                {p === "barcode" && <ScanLine size={12} className="text-emerald-600" />}
                {p === "pack_ocr" && <Package size={12} className="text-orange-600" />}
                {p === "payment_proof" && <FileText size={12} className="text-blue-600" />}
                {p === "general_image" && <ImageIcon size={12} className="text-purple-600" />}
                <span className="font-bold">{purposeLabel(p)}</span>
                <span className="text-blue-400 text-[10px]">
                  {p === "barcode" && "→ cart-এ product যোগ"}
                  {p === "pack_ocr" && "→ MFG/EXP/Batch auto-fill"}
                  {p === "payment_proof" && "→ payment modal-এ set"}
                  {p === "general_image" && "→ শেষ expiry product-এ OCR"}
                </span>
              </div>
            ))}
          </div>

          {/* Last scan */}
          {lastScan && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
              <p className="text-emerald-700 font-black uppercase text-[10px] tracking-wider flex items-center gap-1 mb-1">
                <CheckCircle2 size={12} /> Last received — {purposeLabel(lastScan.purpose)}
              </p>
              <p className="font-mono text-xs text-gray-800 break-all">
                {lastScan.kind === "barcode"
                  ? lastScan.code
                  : `[image — ${lastScan.purpose}]`}
              </p>
            </div>
          )}

          {/* Refresh */}
          <button
            onClick={refresh}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider"
          >
            <RefreshCw size={14} /> New Token
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoteScannerPairingModal;