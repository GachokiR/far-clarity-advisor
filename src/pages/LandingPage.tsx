import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/components/providers/auth-provider'
import { useEffect } from 'react'

export default function LandingPage() {
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard')
    }
  }, [user, isLoading, navigate])

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center px-6 relative overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #00D4FF 0%, #0066FF 25%, #6600FF 50%, #FF0066 75%, #FF6600 100%)'
         }}>
      
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-slate-900/90"></div>
      
      {/* Brand Logo Icon */}
      <div className="relative z-10 mb-8">
        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M12 15v3M10 18h4M12 6V3M8.5 7.5L6.5 5.5M15.5 7.5L17.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="8" cy="9" r="1" fill="currentColor"/>
            <circle cx="16" cy="9" r="1" fill="currentColor"/>
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
            <path d="M9 10L11 8M15 10L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight">
          <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent block mb-2">
            FAR Clarity Advisor
          </span>
          <span className="text-4xl">🚀</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Automate compliance, simplify federal contracting, and win more bids with AI.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            variant="default" 
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold shadow-2xl"
          >
            Login / Sign Up
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.open('https://gaentechnologies.com', '_blank')}
            className="border-2 border-white/50 bg-transparent text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold shadow-2xl backdrop-blur-sm"
          >
            Learn More
          </Button>
        </div>
        
        {/* Brand subtitle */}
        <div className="mt-12">
          <p className="text-white/70 text-lg">
            Powered by{' '}
            <span className="font-bold bg-gradient-to-r from-cyan-200 via-white to-orange-200 bg-clip-text text-transparent">
              Gaen Technologies
            </span>
          </p>
        </div>
      </div>
      
      {/* Floating animation elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-white/30 rounded-full animate-bounce delay-300"></div>
      <div className="absolute top-32 right-16 w-3 h-3 bg-white/40 rounded-full animate-bounce delay-700"></div>
      <div className="absolute bottom-32 left-20 w-2 h-2 bg-white/30 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute bottom-20 right-12 w-3 h-3 bg-white/40 rounded-full animate-bounce delay-500"></div>
    </div>
  )
}