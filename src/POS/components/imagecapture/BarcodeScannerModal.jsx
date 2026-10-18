import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, RefreshCw, ScanLine, Zap, ZapOff } from "lucide-react";

const BarcodeScannerModal = ({ isOpen, onClose, onScan }) => {
  const scannerRef = useRef(null);
  const regionId = "barcode-scanner-region";

  const [error, setError] = useState("");
  const [facing, setFacing] = useState("environment"); // mobile rear camera
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [starting, setStarting] = useState(false);

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        const state = scannerRef.current.getState?.();
        // 2 = SCANNING, 3 = PAUSED
        if (state === 2 || state === 3) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear?.();
      }
    } catch (e) {
      console.warn("Scanner stop warning:", e);
    }
    scannerRef.current = null;
  };

  const startScanner = async () => {
    setError("");
    setStarting(true);

    // DOM element থাকা পর্যন্ত অপেক্ষা
    await new Promise((r) => setTimeout(r, 100));

    try {
      const html5QrCode = new Html5Qrcode(regionId, /* verbose= */ false);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: facing },
        {
          fps: 10,
          qrbox: { width: 260, height: 180 },
          aspectRatio: 1.777,
        },
        (decodedText) => {
          // ✅ Scan successful
          if (navigator.vibrate) navigator.vibrate(80);
          handleDetected(decodedText);
        },
        () => {
          /* per-frame error ignore */
        }
      );

      // Torch support detect
      try {
        const caps = html5QrCode.getRunningTrackCapabilities?.() || {};
        setTorchSupported(!!caps.torch);
      } catch {
        setTorchSupported(false);
      }

      setStarting(false);
    } catch (err) {
      console.error("Camera start failed:", err);
      setError(
        "Camera চালু করা যাচ্ছে না। Permission দিন অথবা HTTPS এ খুলুন।"
      );
      setStarting(false);
    }
  };

  const handleDetected = async (code) => {
    // Duplicate scan আটকাতে scanner pause
    try {
      scannerRef.current?.pause?.(true);
    } catch {}
    onScan?.(code);
    await stopScanner();
    onClose?.();
  };

  const toggleTorch = async () => {
    try {
      await scannerRef.current?.applyVideoConstraints?.({
        advanced: [{ torch: !torchOn }],
      });
      setTorchOn((t) => !t);
    } catch (e) {
      console.warn("Torch toggle failed:", e);
    }
  };

  const switchCamera = async () => {
    await stopScanner();
    setFacing((f) => (f === "environment" ? "user" : "environment"));
  };

  /* ── Lifecycle ── */
  useEffect(() => {
    if (!isOpen) return;
    startScanner();

    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, facing]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ScanLine size={18} className="text-emerald-400" />
            <p className="text-white font-black uppercase text-xs tracking-widest">
              Scan Barcode / QR
            </p>
          </div>
          <button
            onClick={async () => {
              await stopScanner();
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scanner area */}
        <div className="relative">
          <div
            id={regionId}
            className="w-full aspect-[4/3] bg-black"
          />

          {/* Overlay frame */}
          {!error && !starting && (
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

          {starting && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <p className="text-white text-xs font-bold uppercase tracking-widest">
                Starting camera…
              </p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center">
              <p className="text-rose-400 text-xs font-bold">{error}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 flex items-center justify-center gap-3 border-t border-white/10">
          <button
            onClick={switchCamera}
            disabled={!!error || starting}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-40"
            title="Switch camera"
          >
            <RefreshCw size={18} />
          </button>

          {torchSupported && (
            <button
              onClick={toggleTorch}
              disabled={!!error || starting}
              className={`p-3 rounded-full text-white disabled:opacity-40 ${
                torchOn ? "bg-amber-500" : "bg-white/10 hover:bg-white/20"
              }`}
              title="Toggle flashlight"
            >
              {torchOn ? <Zap size={18} /> : <ZapOff size={18} />}
            </button>
          )}
        </div>

        <div className="px-4 pb-4 text-center">
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">
            Barcode / QR ফ্রেমের ভিতরে ধরো — অটো detect হবে
          </p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;