import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-purple-50/20 to-background dark:from-background dark:via-purple-950/20 dark:to-background">
      <div className="w-full max-w-md">
        <div className="relative bg-gradient-to-br from-card to-purple-50/30 dark:to-purple-950/20 border-2 border-primary/30 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center space-y-8">
            {/* Face wireframe illustration */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg
                viewBox="0 0 200 240"
                className="w-full h-full animate-pulse-glow"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {/* Face outline */}
                <ellipse cx="100" cy="120" rx="70" ry="90" className="stroke-purple-500" />

                {/* Vertical center line */}
                <line x1="100" y1="30" x2="100" y2="210" className="stroke-cyan-400/60" strokeDasharray="4 4" />

                {/* Horizontal lines */}
                <line x1="30" y1="80" x2="170" y2="80" className="stroke-cyan-400/60" strokeDasharray="4 4" />
                <line x1="30" y1="120" x2="170" y2="120" className="stroke-cyan-400/60" strokeDasharray="4 4" />
                <line x1="30" y1="160" x2="170" y2="160" className="stroke-cyan-400/60" strokeDasharray="4 4" />

                {/* Face mesh points */}
                <circle cx="70" cy="100" r="3" className="fill-purple-500" />
                <circle cx="130" cy="100" r="3" className="fill-purple-500" />
                <circle cx="100" cy="140" r="3" className="fill-cyan-400" />
                <circle cx="80" cy="170" r="3" className="fill-purple-500" />
                <circle cx="120" cy="170" r="3" className="fill-purple-500" />

                {/* Crosshair in center */}
                <circle cx="100" cy="120" r="25" className="stroke-purple-500" strokeDasharray="5 5" />
                <line x1="75" y1="120" x2="85" y2="120" className="stroke-cyan-400" strokeWidth="2" />
                <line x1="115" y1="120" x2="125" y2="120" className="stroke-cyan-400" strokeWidth="2" />
                <line x1="100" y1="95" x2="100" y2="105" className="stroke-cyan-400" strokeWidth="2" />
                <line x1="100" y1="135" x2="100" y2="145" className="stroke-cyan-400" strokeWidth="2" />
              </svg>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-balance">
                Face
                <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">ID</span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-xs text-pretty">
                FaceID is a Facial recognition App, Which detects Person through facial recognition and shows stored
                information.
              </p>
            </div>

            {/* CTA Button */}
            <Link href="/register" className="w-full">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold rounded-xl h-14 text-lg shadow-lg"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Already registered link */}
        <div className="mt-6 text-center">
          <Link href="/attendance" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Already registered? Mark attendance
          </Link>
        </div>
      </div>
    </div>
  )
}
