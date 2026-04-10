import { createFileRoute, Link } from '@tanstack/react-router'
import Logo from '#/components/Logo'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'

export const Route = createFileRoute('/landing')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <div className="bg-background text-on-surface font-body selection:bg-tertiary-container selection:text-white min-h-screen">
        {/* TopNavBar */}
        <nav className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-stone-200/20 shadow-sm">
          <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-8">
            <span className="text-xl font-headline font-bold tracking-tighter text-stone-900">
              B2B Contract
            </span>
              <div className="hidden md:flex items-center gap-6 font-headline tracking-tight">
                <Link to="/dashboard" className="text-stone-900 font-bold border-b-2 border-stone-900 pb-1 hover:opacity-80 transition-opacity">Dashboard</Link>
                <Link to="/about" className="text-stone-500 hover:text-stone-700 transition-colors">About</Link>
                <Link to="/login" className="text-stone-500 hover:text-stone-700 transition-colors">Login</Link>
                <Link to="/register" className="text-stone-500 hover:text-stone-700 transition-colors">Register</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-stone-100/50 rounded-lg transition-all active:scale-95">
                <span className="material-symbols-outlined text-stone-900">notifications</span>
              </button>
              <button className="p-2 hover:bg-stone-100/50 rounded-lg transition-all active:scale-95">
                <span className="material-symbols-outlined text-stone-900">settings</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden border border-outline-variant/20">
                <img
                    alt="User profile avatar"
                    data-alt="close-up professional headshot of a corporate executive with a clean background and soft studio lighting"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0AFDVqK4SPnNxyg3JmSgdVB3rlCAPpqirZCfrCVq7uREw9RUcqFUv8i4eFi4PNda47kohJX83ZxkhA3p4zSYgGC6hZhZLzhxQ_d-JPjfwz3LB5_p6MlGKnP34JRWh6mNK-oEqZygpDx1IsF_xehFjqT_Ho6ldvnFnVh9X3ZHNN7N5O23RvjNORzby_-nk8BZotJzYXiNtf4BsKDWPyVk-ks25T--sVbudhOQW2Cax1ZrxAAoP8syPzIMMo5fOUwSvim_S7goVm1Y6"
                />
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-24">
          {/* Hero Section: Dossier Style */}
          <section className="relative px-8 py-20 md:py-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
            <span className="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container text-xs font-label font-bold uppercase tracking-widest rounded-lg">
              Institutional Core
            </span>
              <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface leading-[1.1] tracking-tighter">
                The Archive of <br/><span className="text-stone-400">High-Trust Liquidity.</span>
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed">
                Streamline complex B2B negotiations through our curated architectural interface. A digital dossier designed for the modern institutional entity.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {/* Zastosowano stylizację z .satin-button używając klas Tailwinda */}
                <Link to="/register" className="inline-block">
                  <button className="bg-gradient-to-br from-black to-[#3c3b3b] hover:opacity-90 transition-opacity duration-200 text-on-primary px-8 py-4 font-headline font-bold tracking-tight rounded-lg flex items-center gap-2">
                    Initialize Contract
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </Link>
                <Link to="/dashboard" className="inline-block">
                  <button className="bg-secondary-container text-on-secondary-container px-8 py-4 font-headline font-bold tracking-tight rounded-lg hover:bg-stone-300 transition-colors">
                    View Repository
                  </button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] bg-surface-container-low rounded-lg overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700">
                <img
                    className="w-full h-full object-cover grayscale opacity-90"
                    data-alt="low angle shot of a modern glass and steel skyscraper reaching into a clear sky with sharp architectural lines"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuConlSopnWBjwYp4BvvIXdfkLjzGvegW6iVWapyVRbGcqhuPlOJl0GId1KjjQeCVsOb0ewd1PbM_ma7XC9YHDP31eSV58C4UDXpywr6K0bf6nAw1TS1sMjtnfuCPczkF8oZ9cPP0Vb1cmxAWG3XvntmA-AFpt56WP3D97lbwWGwzzaZGDQ5aaIeZkx0ne6Mn1lpO9QWYYinLtSxf_mOpQehGYxum5UxNNUSOx6QUYXTcomDEECtzKBSlP5GtZnm7ELMsQhsOtfxDkk9"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/85 backdrop-blur-md rounded shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 font-label font-bold">Document status</p>
                      <p className="text-stone-900 font-headline font-bold">Execution Pending</p>
                    </div>
                    <span className="material-symbols-outlined text-tertiary-fixed">verified</span>
                  </div>
                  <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/4"></div>
                  </div>
                </div>
              </div>

              {/* Asymmetric Floating Element */}
              <div className="absolute -bottom-8 -left-8 p-4 bg-surface-container-lowest rounded shadow-lg hidden md:block border border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-tertiary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">handshake</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold font-headline">Counterparty Verified</p>
                    <p className="text-[10px] text-stone-500">Tier 1 Institutional</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Section */}
          <section className="bg-surface-container-low py-16 px-8">
            <div className="max-w-7xl mx-auto">
              <p className="text-center text-[10px] font-label font-bold uppercase tracking-[0.2em] text-stone-400 mb-12">Trusted by Global Entities</p>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
                <span className="text-2xl font-headline font-black tracking-tighter">FINANCE.CO</span>
                <span className="text-2xl font-headline font-black tracking-tighter">STRUCT_URA</span>
                <span className="text-2xl font-headline font-black tracking-tighter">NOMAD_GLOBAL</span>
                <span className="text-2xl font-headline font-black tracking-tighter">CORE_ASSET</span>
              </div>
            </div>
          </section>

          {/* Features: Bento Grid Layout */}
          <section className="px-8 py-24 max-w-7xl mx-auto">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 tracking-tight">The Dossier Advantage</h2>
              <p className="text-on-surface-variant leading-relaxed">Precision-engineered for high-stakes B2B interactions, removing friction from every layer of the transaction.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Large Feature Card */}
              <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-lg border border-stone-200/30 flex flex-col justify-between min-h-[400px]">
                <div>
                  <span className="material-symbols-outlined text-4xl text-primary mb-6">description</span>
                  <h3 className="text-2xl font-headline font-bold mb-4">Semantic Repository</h3>
                  <p className="text-on-surface-variant max-w-md">Our AI-driven repository indexes every clause, ensuring immediate retrieval of critical legal obligations and performance triggers across your entire portfolio.</p>
                </div>
                <div className="mt-8 flex gap-2">
                  <span className="px-3 py-1 bg-stone-100 rounded text-[10px] font-bold">AUTO-INDEXING</span>
                  <span className="px-3 py-1 bg-stone-100 rounded text-[10px] font-bold">OCR_READY</span>
                </div>
              </div>

              {/* Secondary Feature Card */}
              <div className="bg-stone-900 text-white p-8 rounded-lg flex flex-col justify-between min-h-[400px]">
                <div>
                  <span className="material-symbols-outlined text-4xl text-stone-400 mb-6">shield</span>
                  <h3 className="text-2xl font-headline font-bold mb-4">Encrypted Compliance</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">Institutional-grade security layers protect your most sensitive strategic data. SOC2 Type II certified and GDPR compliant as standard.</p>
                </div>
                <a className="text-sm font-bold border-b border-white/30 self-start pb-1 hover:border-white transition-all" href="#">Security Protocol</a>
              </div>

              {/* Small Grid Items */}
              <div className="bg-surface-container-low p-8 rounded-lg border border-stone-200/30">
                <span className="material-symbols-outlined text-primary mb-4">analytics</span>
                <h4 className="font-headline font-bold mb-2">Marketplace Insights</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">Real-time benchmarking against industry-standard contract terms and pricing models.</p>
              </div>
              <div className="bg-surface-container-low p-8 rounded-lg border border-stone-200/30">
                <span className="material-symbols-outlined text-primary mb-4">history</span>
                <h4 className="font-headline font-bold mb-2">Version Lineage</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">Complete immutable history of every negotiation touchpoint and redline adjustment.</p>
              </div>
              <div className="bg-surface-container-low p-8 rounded-lg border border-stone-200/30">
                <span className="material-symbols-outlined text-primary mb-4">bolt</span>
                <h4 className="font-headline font-bold mb-2">Instant Execution</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">Seamless digital signatures with integrated identity verification for finalization.</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-8 py-24 mb-24">
            <div className="max-w-7xl mx-auto rounded-lg bg-surface-container-high p-12 md:p-24 relative overflow-hidden text-center">
              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter">Elevate Your Institutional Standard.</h2>
                <p className="text-on-surface-variant text-lg">Join the premier marketplace for B2B contracts. Professional, precise, and profoundly stable.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register" className="inline-block">
                    <button className="bg-gradient-to-br from-black to-[#3c3b3b] hover:opacity-90 transition-opacity duration-200 text-on-primary px-10 py-5 font-headline font-bold rounded-lg shadow-lg w-full sm:w-auto">
                      Request Demo
                    </button>
                  </Link>
                  <Link to="/login" className="inline-block">
                    <button className="bg-surface-container-lowest border border-stone-200 text-on-surface px-10 py-5 font-headline font-bold rounded-lg hover:bg-stone-50 transition-colors w-full sm:w-auto">
                      Speak with a Curator
                    </button>
                  </Link>
                </div>
              </div>

              {/* Decorative Abstract Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-stone-300/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-tertiary-container/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full py-12 bg-stone-50 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="font-inter text-xs uppercase tracking-widest text-stone-400">© 2024 Dossier Institutional. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 font-inter text-xs uppercase tracking-widest">
              <a className="text-stone-400 hover:text-stone-900 transition-all" href="#privacy">Privacy Policy</a>
              <a className="text-stone-400 hover:text-stone-900 transition-all" href="#terms">Terms of Service</a>
              <a className="text-stone-400 hover:text-stone-900 transition-all" href="#security">Security</a>
              <Link to="/about" className="text-stone-400 hover:text-stone-900 transition-all">Compliance</Link>
            </div>
          </div>
        </footer>
      </div>
  )
}