import React, { useEffect, useRef, useState, useCallback } from "react";
import Tesseract from "tesseract.js";
import { Camera, RefreshCw, X, Loader2, CheckCircle2, ScanLine, Pencil, Save } from "lucide-react";
import { parseExpiryText, isParseResultComplete, getParseResultSummary } from "../../utils/parseExpiryText";

const ExpiryScannerModal = ({ isOpen, onClose, onExtract }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [facing, setFacing] = useState("environment");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null); // { mfg, exp, batch, raw }
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [rawText, setRawText] = useState("");

  /* ── Stream start/stop ── */
  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startStream = useCallback(async () => {
    stopStream();
    setReady(false);
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Camera access পাওয়া যাচ্ছে না। Permission দিন বা HTTPS এ খুলুন।");
    }
  }, [facing, stopStream]);

  useEffect(() => {
    if (!isOpen) return;
    startStream();
    return () => stopStream();
  }, [isOpen, startStream, stopStream]);

  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setPreviewImage(null);
      setProcessing(false);
      setProgress(0);
      setIsEditing(false);
      setRawText("");
    }
  }, [isOpen]);

  /* ── OCR processing on a file/blob ── */
  const runOCR = async (fileOrBlob) => {
    try {
      setProcessing(true);
      setProgress(0);
      setResult(null);

      const { data } = await Tesseract.recognize(fileOrBlob, "eng+ben", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const parsed = parseExpiryText(data.text || "");

      // 🆕 Debug logs (test-এর পর remove করে দেবে)
      console.log("=== RAW OCR TEXT ===");
      console.log(data.text);
      console.log("=== PARSED RESULT ===");
      console.log({
        mfg: parsed.manufacturing_date,
        exp: parsed.expiry_date,
        batch: parsed.batch_no,
      });
      console.log("Complete?", isParseResultComplete(parsed));
      console.log(getParseResultSummary(parsed));

      setRawText(data.text || "");
      setResult({
        manufacturing_date: parsed.manufacturing_date,
        expiry_date: parsed.expiry_date,
        batch_no: parsed.batch_no,
        raw: parsed.raw,
      });

      // 🆕 Auto-open edit mode if some fields missing
      if (!isParseResultComplete(parsed)) {
        setIsEditing(true);
      }
    } catch (err) {
      console.error("OCR failed:", err);
      alert("OCR প্রসেস ব্যর্থ। আবার চেষ্টা করুন।");
    } finally {
      setProcessing(false);
    }
  };

  /* ── Capture from camera ── */
  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (facing === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const previewUrl = URL.createObjectURL(blob);
        setPreviewImage(previewUrl);
        stopStream();
        await runOCR(blob);
      },
      "image/jpeg",
      0.95
    );
  };

  /* ── Pick from gallery ── */
  const handleGallery = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
    stopStream();
    runOCR(file);
    e.target.value = "";
  };

  /* ── Retake ── */
  const handleRetake = () => {
    setResult(null);
    setPreviewImage(null);
    setProgress(0);
    setIsEditing(false);
    setRawText("");
    startStream();
  };

  /* ── Apply result ── */
  const handleApply = () => {
    if (!result) return;
    onExtract?.({
      manufacturing_date: result.manufacturing_date,
      expiry_date: result.expiry_date,
      batch_no: result.batch_no,
    });
    onClose();
  };

  /* ── Update a single field ── */
  const updateField = (key, value) => {
    setResult((prev) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  const isComplete = isParseResultComplete(result);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <ScanLine size={18} className="text-emerald-400" />
            <p className="text-white font-black uppercase text-xs tracking-widest">
              Scan Medicine Pack
            </p>
          </div>
          <button
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-4 p-4">
            {/* Camera / Preview */}
            <div className="relative aspect-video md:aspect-square bg-black rounded-2xl overflow-hidden">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="captured"
                  className="w-full h-full object-contain"
                />
              ) : cameraError ? (
                <div className="w-full h-full flex items-center justify-center p-6 text-center">
                  <p className="text-rose-400 text-xs font-bold">{cameraError}</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${
                    facing === "user" ? "scale-x-[-1]" : ""
                  }`}
                />
              )}

              {processing && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 z-10">
                  <Loader2 className="animate-spin text-emerald-400" size={32} />
                  <p className="text-white text-xs font-bold uppercase tracking-widest">
                    Analyzing pack... {progress}%
                  </p>
                  <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Result panel */}
            <div className="flex flex-col gap-3">
              {/* Tips (no result yet) */}
              {!result && !processing && (
                <div className="text-white/60 text-[11px] font-semibold leading-relaxed bg-white/5 p-4 rounded-2xl">
                  <p className="text-emerald-400 font-black uppercase text-[10px] mb-2 tracking-wider">
                    💡 Tips for best result
                  </p>
                  <ul className="space-y-1">
                    <li>• প্যাকেট ভালো আলোতে ধরো</li>
                    <li>• MFG/EXP/Batch সোজাসুজি সামনে রাখো</li>
                    <li>• ক্যামেরা থেকে ১০–১৫ সে.মি. দূরত্ব রাখো</li>
                    <li>• ছবি তোলার সময় হাত স্থির রাখো</li>
                    <li>• ছবির মধ্যে পুরো label থাকা জরুরি</li>
                  </ul>
                </div>
              )}

              {result && (
                <div className="space-y-3">
                  {/* Status badge */}
                  <div className="flex items-center justify-between">
                    <p className={`font-black uppercase text-[10px] tracking-widest flex items-center gap-1.5 ${
                      isComplete ? "text-emerald-400" : "text-amber-400"
                    }`}>
                      <CheckCircle2 size={12} />
                      {isComplete ? "Detected Data" : "Partial Detection"}
                    </p>
                    {!isComplete && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 uppercase tracking-wider"
                      >
                        {isEditing ? <Save size={10} /> : <Pencil size={10} />}
                        {isEditing ? "Done" : "Edit"}
                      </button>
                    )}
                  </div>

                  {/* Warning if not complete */}
                  {!isComplete && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-[10px] text-amber-400 font-semibold">
                      ⚠️ কিছু তথ্য পাওয়া যায়নি। দয়া করে হাতে লিখে পূরণ করুন।
                    </div>
                  )}

                  {/* Result fields */}
                  <div className="bg-white/5 rounded-2xl p-3 space-y-2 border border-white/10">
                    <Field
                      label="Manufacturing Date"
                      value={result.manufacturing_date}
                      editable={isEditing}
                      onChange={(v) => updateField("manufacturing_date", v)}
                      type="date"
                    />
                    <Field
                      label="Expiry Date"
                      value={result.expiry_date}
                      editable={isEditing}
                      onChange={(v) => updateField("expiry_date", v)}
                      type="date"
                    />
                    <Field
                      label="Batch No"
                      value={result.batch_no}
                      editable={isEditing}
                      onChange={(v) => updateField("batch_no", v)}
                      type="text"
                    />
                  </div>

                  {/* Raw OCR text */}
                  {rawText && (
                    <details className="text-white/40 text-[10px]">
                      <summary className="cursor-pointer font-bold uppercase tracking-wider">
                        Show raw OCR text
                      </summary>
                      <pre className="mt-2 p-2 bg-black/40 rounded-lg whitespace-pre-wrap max-h-40 overflow-auto text-[9px]">
                        {rawText}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 shrink-0">
          {!previewImage && !processing && (
            <>
              <button
                onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                title="Switch camera"
              >
                <RefreshCw size={18} />
              </button>

              <button
                onClick={handleCapture}
                disabled={!ready}
                className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 shadow-lg disabled:opacity-40 flex items-center justify-center active:scale-90 transition"
                title="Capture"
              >
                <Camera size={24} className="text-emerald-500" />
              </button>

              <label
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                title="Choose from gallery"
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleGallery}
                />
                🖼️
              </label>
            </>
          )}

          {previewImage && !processing && result && (
            <>
              <button
                onClick={handleRetake}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider"
              >
                Retake
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2"
              >
                <CheckCircle2 size={14} /> Apply to Item
              </button>
            </>
          )}

          {previewImage && !processing && !result && (
            <button
              onClick={handleRetake}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider"
            >
              Retake
            </button>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

/* ── Editable Field Component ── */
const Field = ({ label, value, editable, onChange, type = "text" }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[10px] font-black text-white/40 uppercase tracking-wider shrink-0">
      {label}
    </span>
    {editable ? (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="—"
        className="text-xs font-mono font-bold text-emerald-400 bg-white/10 border border-emerald-400/30 rounded-lg px-2 py-1 outline-none focus:border-emerald-400 focus:bg-white/15 w-44 text-right"
      />
    ) : (
      <span
        className={`text-xs font-mono font-bold truncate ${
          value ? "text-emerald-400" : "text-white/30"
        }`}
      >
        {value || "—"}
      </span>
    )}
  </div>
);

export default ExpiryScannerModal;