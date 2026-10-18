import React, { useRef, useState, useEffect, useCallback } from "react";
import { Camera, RefreshCw, X, Check } from "lucide-react";

const CameraCapture = ({ onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [facing, setFacing] = useState("environment"); // mobile rear camera

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startStream = useCallback(async () => {
    stopStream();
    setReady(false);
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
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
      setError(
        "Camera access করতে পারছি না। Permission দিন বা HTTPS এ খুলুন।"
      );
    }
  }, [facing, stopStream]);

  useEffect(() => {
    startStream();
    return () => stopStream();
  }, [startStream, stopStream]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    // mirror for front camera
    if (facing === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File(
          [blob],
          `capture-${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );
        stopStream();
        onCapture(file);
      },
      "image/jpeg",
      0.92
    );
  };

  const toggleFacing = () => {
    setFacing((f) => (f === "environment" ? "user" : "environment"));
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <p className="text-white font-black uppercase text-xs tracking-widest">
            Take Photo
          </p>
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

        {/* Video area */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {error ? (
            <p className="text-rose-400 text-xs font-bold px-6 text-center">
              {error}
            </p>
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
          {!ready && !error && (
            <p className="absolute text-white/60 text-xs font-bold uppercase tracking-widest">
              Loading camera...
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 flex items-center justify-center gap-4">
          <button
            onClick={toggleFacing}
            disabled={!!error}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-40"
            title="Switch camera"
          >
            <RefreshCw size={18} />
          </button>

          <button
            onClick={handleCapture}
            disabled={!ready || !!error}
            className="w-16 h-16 rounded-full bg-white border-4 border-rose-500 shadow-lg disabled:opacity-40 flex items-center justify-center active:scale-90 transition"
            title="Capture"
          >
            <Camera size={24} className="text-rose-500" />
          </button>

          <div className="w-12" /> {/* spacer for symmetry */}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraCapture;