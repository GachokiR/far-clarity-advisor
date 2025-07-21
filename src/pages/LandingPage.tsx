import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDemoAuth } from '@/hooks/useDemoAuth';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { isDemoUser } = useDemoAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && (user || isDemoUser)) {
      navigate('/dashboard');
    }
  }, [user, isDemoUser, loading, navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 via-purple-600 via-pink-500 to-orange-500 text-white relative overflow-hidden">
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-slate-900/90"></div>
      
      {/* Animated Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-cyan-400/20 via-transparent to-transparent animate-spin-slow"></div>
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-pink-500/20 via-transparent to-transparent animate-spin-reverse"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-600/30 to-pink-500/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/20 z-50 shadow-2xl">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 via-purple-600 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 relative">
              {/* Circuit lightbulb icon matching your brand */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M12 15v3M10 18h4M12 6V3M8.5 7.5L6.5 5.5M15.5 7.5L17.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="8" cy="9" r="1" fill="currentColor"/>
                <circle cx="16" cy="9" r="1" fill="currentColor"/>
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
                <path d="M9 10L11 8M15 10L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur-md opacity-50 -z-10"></div>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Gaen Technologies
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
            <a href="/auth" className="hover:text-cyan-400 transition-colors">Login</a>
          </div>
          
          <a 
            href="/auth" 
            className="bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-600 via-pink-500 to-orange-500 px-8 py-3 rounded-full font-bold text-white hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
          >
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Floating elements around the title */}
          <div className="absolute top-10 left-10 w-4 h-4 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-20 right-16 w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-700"></div>
          <div className="absolute bottom-40 left-20 w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-1000"></div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent block">
              Transform FAR
            </span>
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent block">
              Compliance Into
            </span>
            <span className="bg-gradient-to-r from-pink-500 via-orange-500 to-cyan-400 bg-clip-text text-transparent block">
              Simple Actions
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Stop struggling with complex Federal Acquisition Regulations. Our AI-powered platform turns confusing compliance requirements into clear, actionable steps that save time and reduce risk.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <a 
              href="/auth" 
              className="group bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-600 via-pink-500 to-orange-500 px-10 py-5 rounded-full font-bold text-xl text-white hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                🚀 Start Free 14-Day Trial
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </a>
            <a 
              href="/auth" 
              className="group border-3 border-white/30 bg-white/10 backdrop-blur-sm px-10 py-5 rounded-full font-bold text-xl hover:border-cyan-400 hover:text-cyan-400 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-3">
                👀 See Live Demo
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </span>
            </a>
          </div>

          {/* Stats with enhanced gradients */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto p-8 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-purple-600/20 to-pink-500/20 opacity-50"></div>
            
            <div className="text-center relative z-10">
              <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">85%</div>
              <div className="text-white/80 text-sm font-medium">Faster Compliance</div>
            </div>
            <div className="text-center relative z-10">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-white/80 text-sm font-medium">FAR Clauses Covered</div>
            </div>
            <div className="text-center relative z-10">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">99.9%</div>
              <div className="text-white/80 text-sm font-medium">Accuracy Rate</div>
            </div>
            <div className="text-center relative z-10">
              <div className="text-4xl font-black bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent mb-2">1000+</div>
              <div className="text-white/80 text-sm font-medium">Contractors Trust Us</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Everything You Need for FAR Compliance
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              From document analysis to audit preparation, we've got every aspect of government contracting compliance covered with cutting-edge AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: "🤖", 
                title: "AI-Powered Analysis", 
                desc: "Upload any contract and get instant FAR clause identification, risk assessment, and compliance recommendations powered by advanced AI.",
                gradient: "from-cyan-400 to-blue-500"
              },
              { 
                icon: "📋", 
                title: "DCAA Audit Preparation", 
                desc: "Stay audit-ready with automated checklists, documentation tracking, and real-time compliance monitoring for DCAA requirements.",
                gradient: "from-blue-500 to-purple-600"
              },
              { 
                icon: "🛡️", 
                title: "NIST 800-171 Security", 
                desc: "Track and implement all 110 security controls with guided implementation plans and progress monitoring.",
                gradient: "from-purple-600 to-pink-500"
              },
              { 
                icon: "🏛️", 
                title: "GSA Schedule Integration", 
                desc: "Verify vendor eligibility, check schedule numbers, and ensure compliance with GSA requirements automatically.",
                gradient: "from-pink-500 to-orange-500"
              },
              { 
                icon: "📊", 
                title: "Real-Time Dashboard", 
                desc: "Monitor compliance progress, track deadlines, and get actionable insights with our comprehensive analytics dashboard.",
                gradient: "from-orange-500 to-cyan-400"
              },
              { 
                icon: "⚡", 
                title: "Instant Alerts", 
                desc: "Never miss a deadline with automated notifications for compliance requirements, regulation changes, and audit dates.",
                gradient: "from-cyan-400 to-purple-600"
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white/10 border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-500 hover:transform hover:-translate-y-3 hover:scale-105 backdrop-blur-xl relative overflow-hidden">
                {/* Gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}></div>
                
                <div className="relative z-10">
                  <div className={`text-5xl mb-6 w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed">{feature.desc}</p>
                </div>
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white/2 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              See Results in Minutes, Not Months
            </h2>
            <p className="text-xl text-gray-300">
              Our streamlined process gets you from confused to compliant faster than any other solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "1", title: "Upload Documents", desc: "Drag and drop your contracts, RFPs, or any government documents. We support PDF, DOC, and TXT files." },
              { num: "2", title: "AI Analysis", desc: "Our AI instantly identifies FAR clauses, assesses risks, and generates a comprehensive compliance checklist." },
              { num: "3", title: "Get Actionable Results", desc: "Receive clear, prioritized action items with timelines, cost estimates, and step-by-step implementation guides." },
              { num: "4", title: "Track Progress", desc: "Monitor your compliance journey with real-time dashboards, automated alerts, and audit-ready documentation." }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                <p className="text-gray-300 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300">
              No hidden fees, no complex contracts. Choose the plan that fits your business size and compliance needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "Free",
                period: "14-day trial",
                features: ["Up to 10 document analyses", "Basic FAR clause identification", "Compliance checklist generation", "Email support", "Standard security controls"],
                cta: "Start Free Trial",
                featured: false
              },
              {
                name: "Professional",
                price: "$299",
                period: "per month",
                features: ["Unlimited document analyses", "Advanced AI recommendations", "DCAA audit preparation", "NIST 800-171 tracking", "GSA schedule verification", "Real-time alerts & notifications", "Priority support", "Custom compliance reports"],
                cta: "Start Professional Trial",
                featured: true
              },
              {
                name: "Enterprise",
                price: "$799",
                period: "per month",
                features: ["Everything in Professional", "Multi-user team accounts", "Custom workflow automation", "API access & integrations", "Dedicated compliance manager", "White-label options", "24/7 phone support", "Custom training sessions"],
                cta: "Contact Sales",
                featured: false
              }
            ].map((plan, index) => (
              <div key={index} className={`bg-white/5 border rounded-2xl p-8 text-center relative ${plan.featured ? 'border-purple-500 bg-purple-500/10' : 'border-white/10'} hover:transform hover:-translate-y-2 transition-all duration-300`}>
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                <div className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {plan.price}
                </div>
                <div className="text-gray-400 mb-6">{plan.period}</div>
                <ul className="text-left mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href="/auth" 
                  className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 inline-block"
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 mx-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4 text-white">Ready to Simplify Your Compliance?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join over 1,000 government contractors who trust Gaen Technologies to keep them compliant and competitive. Start your free trial today - no credit card required.
          </p>
          <a 
            href="/auth" 
            className="bg-white text-purple-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 inline-block"
          >
            🚀 Start Your Free Trial Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/10 py-12 px-6 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Product</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#features" className="block hover:text-cyan-400 transition-colors">Features</a>
                <a href="#pricing" className="block hover:text-cyan-400 transition-colors">Pricing</a>
                <a href="#" className="block hover:text-cyan-400 transition-colors">Integrations</a>
                <a href="#" className="block hover:text-cyan-400 transition-colors">Security</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Resources</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-cyan-400 transition-colors">Documentation</a>
                <a href="#" className="block hover:text-cyan-400 transition-colors">Blog</a>
                <a href="#" className="block hover:text-cyan-400 transition-colors">Case Studies</a>
                <a href="#" className="block hover:text-cyan-400 transition-colors">Webinars</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Support</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-cyan-400 transition-colors">Help Center</a>
                <a href="mailto:hello@gaentechnologies.com" className="block hover:text-cyan-400 transition-colors">Contact Us</a>
                <a href="#" className="block hover:text-cyan-400 transition-colors">Training</a>
                <a href="#" className="block hover:text-cyan-400 transition-colors">System Status</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Company</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-cyan-400 transition-colors">About Gaen Technologies</a>
                <a href="#" className="block hover:text-cyan-400 transition-colors">Careers</a>
                <a href="#" className="block hover:text-cyan-400 transition-colors">Press</a>
                <a href="#" className="block hover:text-cyan-400 transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Gaen Technologies. All rights reserved. | Simplify Life</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;