import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-foreground/5 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-7xl font-bold text-foreground">404</span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Page Not Found</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto text-pretty">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            to="/"
            className="px-8 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            Go Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors w-full sm:w-auto"
          >
            Go Back
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="pt-8 text-muted-foreground/50 text-sm">
          <p>Lost? Try using the navigation menu or search.</p>
        </div>
      </div>
    </div>
  )
}
