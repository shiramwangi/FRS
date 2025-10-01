"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"

interface FaceScannerProps {
  onCapture: (imageData: string) => void
  isScanning?: boolean
}

export function FaceScanner({ onCapture, isScanning = false }: FaceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [progress, setProgress] = useState(0)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string>("")
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isScanning) {
      // Simulate scanning progress
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 2
        })
      }, 50)
    } else {
      setProgress(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isScanning])

  useEffect(() => {
    if (progress >= 100 && isScanning) {
      setTimeout(() => {
        captureImage()
      }, 0)
    }
  }, [progress, isScanning])

  useEffect(() => {
    startCamera()

    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      setHasPermission(true)
      setError("")

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                setVideoReady(true)
              })
              .catch((err) => {
                console.error("Error playing video:", err)
                setError("Failed to start video")
              })
          }
        }
      }
    } catch (error) {
      console.error("Camera error:", error)
      setHasPermission(false)
      setError(error instanceof Error ? error.message : "Camera access denied")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && videoReady) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        // Mirror the image horizontally
        context.translate(canvas.width, 0)
        context.scale(-1, 1)
        context.drawImage(video, 0, 0)

        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        onCapture(imageData)
      }
    }
  }

  if (hasPermission === false) {
    return (
      <Card className="border-2 border-destructive/30 rounded-3xl p-8 text-center bg-card">
        <p className="text-destructive font-medium">Camera access denied</p>
        <p className="text-sm text-muted-foreground mt-2">Please allow camera access to continue</p>
        {error && <p className="text-xs text-destructive/70 mt-2">{error}</p>}
      </Card>
    )
  }

  if (hasPermission === null || !videoReady) {
    return (
      <Card className="border-2 border-primary/30 rounded-3xl p-8 text-center bg-card">
        <p className="text-muted-foreground">Starting camera...</p>
      </Card>
    )
  }

  return (
    <div className="relative">
      <Card className="border-2 border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl bg-slate-900/50">
        <div className="relative aspect-[3/4] bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />

          {/* Canvas for capture (hidden) */}
          <canvas ref={canvasRef} className="hidden" />

          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Face outline with detailed recognition grid */}
              <div className="relative w-64 h-80">
                {/* Animated scanning line */}
                <div
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-100"
                  style={{ top: `${progress}%` }}
                />
                {/* Facial recognition grid overlay */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 256 320"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  {/* Corner brackets */}
                  <path d="M 40 40 L 40 80 M 40 40 L 80 40" className="stroke-cyan-400 animate-pulse" strokeWidth="3" />
                  <path
                    d="M 216 40 L 216 80 M 216 40 L 176 40"
                    className="stroke-cyan-400 animate-pulse"
                    strokeWidth="3"
                  />
                  <path
                    d="M 40 280 L 40 240 M 40 280 L 80 280"
                    className="stroke-cyan-400 animate-pulse"
                    strokeWidth="3"
                  />
                  <path
                    d="M 216 280 L 216 240 M 216 280 L 176 280"
                    className="stroke-cyan-400 animate-pulse"
                    strokeWidth="3"
                  />

                  {/* Face mesh wireframe - vertical lines */}
                  <line x1="128" y1="60" x2="128" y2="280" className="stroke-cyan-400/40" />
                  <line x1="90" y1="80" x2="90" y2="260" className="stroke-cyan-400/30" />
                  <line x1="166" y1="80" x2="166" y2="260" className="stroke-cyan-400/30" />
                  <line x1="70" y1="100" x2="70" y2="240" className="stroke-cyan-400/20" />
                  <line x1="186" y1="100" x2="186" y2="240" className="stroke-cyan-400/20" />

                  {/* Face mesh wireframe - horizontal lines */}
                  <line x1="60" y1="100" x2="196" y2="100" className="stroke-cyan-400/30" />
                  <line x1="70" y1="130" x2="186" y2="130" className="stroke-cyan-400/30" />
                  <line x1="80" y1="160" x2="176" y2="160" className="stroke-cyan-400/40" />
                  <line x1="70" y1="190" x2="186" y2="190" className="stroke-cyan-400/30" />
                  <line x1="80" y1="220" x2="176" y2="220" className="stroke-cyan-400/30" />
                  <line x1="90" y1="250" x2="166" y2="250" className="stroke-cyan-400/20" />

                  {/* Face mesh dots - key facial points */}
                  {/* Eyes */}
                  <circle cx="90" cy="120" r="3" className="fill-cyan-400 animate-pulse" />
                  <circle cx="166" cy="120" r="3" className="fill-cyan-400 animate-pulse" />

                  {/* Nose */}
                  <circle cx="128" cy="160" r="3" className="fill-cyan-400 animate-pulse" />
                  <circle cx="118" cy="170" r="2" className="fill-cyan-400/60 animate-pulse" />
                  <circle cx="138" cy="170" r="2" className="fill-cyan-400/60 animate-pulse" />

                  {/* Mouth corners */}
                  <circle cx="100" cy="200" r="3" className="fill-cyan-400 animate-pulse" />
                  <circle cx="156" cy="200" r="3" className="fill-cyan-400 animate-pulse" />
                  <circle cx="128" cy="210" r="2" className="fill-cyan-400/60 animate-pulse" />

                  {/* Cheekbones */}
                  <circle cx="70" cy="140" r="2" className="fill-cyan-400/60 animate-pulse" />
                  <circle cx="186" cy="140" r="2" className="fill-cyan-400/60 animate-pulse" />

                  {/* Jawline */}
                  <circle cx="80" cy="230" r="2" className="fill-cyan-400/60 animate-pulse" />
                  <circle cx="176" cy="230" r="2" className="fill-cyan-400/60 animate-pulse" />
                  <circle cx="128" cy="260" r="2" className="fill-cyan-400/60 animate-pulse" />

                  {/* Forehead */}
                  <circle cx="128" cy="80" r="2" className="fill-cyan-400/60 animate-pulse" />
                  <circle cx="100" cy="90" r="2" className="fill-cyan-400/60 animate-pulse" />
                  <circle cx="156" cy="90" r="2" className="fill-cyan-400/60 animate-pulse" />

                  {/* Curved face outline */}
                  <ellipse
                    cx="128"
                    cy="160"
                    rx="90"
                    ry="120"
                    className="stroke-cyan-400/50"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>

                {/* Center crosshair */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping opacity-75" />
                    <div className="absolute inset-0 border-2 border-cyan-400 rounded-full" />
                    {/* Crosshair lines */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-0.5 bg-cyan-400 absolute" />
                      <div className="w-0.5 h-8 bg-cyan-400 absolute" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {isScanning && (
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="space-y-2">
                <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-white text-sm font-medium drop-shadow-lg">Scanning... {progress}%</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
