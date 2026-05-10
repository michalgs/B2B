import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent } from '#/components/ui/card'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-tertiary-container selection:text-white min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-stone-200/20 shadow-sm">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/landing" className="hover:opacity-80 transition-opacity">
              <span className="text-xl font-headline font-bold tracking-tighter text-stone-900">
                B2B Contract
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6 font-headline tracking-tight">
              <Link to="/about" className="text-stone-900 font-bold border-b-2 border-stone-900 pb-1 hover:opacity-80 transition-opacity">About</Link>
              <Link to="/dashboard" className="text-stone-500 hover:text-stone-700 transition-colors">Dashboard</Link>
              <Link to="/login" className="text-stone-500 hover:text-stone-700 transition-colors">Login</Link>
              <Link to="/register" className="text-stone-500 hover:text-stone-700 transition-colors">Register</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative px-8 py-20 md:py-32 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <span className="inline-block px-3 py-1 bg-tertiary-container text-on-tertiary-container text-xs font-label font-bold uppercase tracking-widest rounded-lg">
                Our Philosophy
              </span>

              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface leading-tight tracking-tight">
                  Professional B2B <span className="text-stone-400">Contract Management</span>
                </h1>

                <Card className="bg-surface-container-lowest border border-stone-200/30 p-12 shadow-lg">
                  <CardContent className="p-0 space-y-6">
                    <p className="text-lg leading-relaxed text-on-surface font-body">
                      <em className="font-semibold">Dossier empowers institutions to negotiate, manage, and execute business contracts with precision and confidence.</em>
                    </p>

                    <p className="text-lg leading-relaxed text-on-surface font-body">
                      <em>In a world of complex agreements and high-stakes negotiations, you need a partner that understands the nuances of institutional contracting.</em>
                    </p>

                    <p className="text-lg leading-relaxed text-on-surface font-body">
                      <em>We provide the tools, insights, and security frameworks that transform contract management from a necessary burden into a competitive advantage.</em>
                    </p>

                    <p className="text-lg leading-relaxed text-on-surface font-body">
                      <em>Every clause matters. Every deadline counts. Every counterparty relationship shapes your future. We help you navigate it all.</em>
                    </p>

                    <p className="text-sm text-stone-500 pt-4 border-t border-stone-200/30 font-headline font-bold tracking-tight">
                      Streamlined. Secure. Strategic.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right: Visuals */}
            <div className="space-y-8">
               <div className="aspect-square bg-surface-container-low rounded-lg overflow-hidden shadow-2xl">
                 <img
                   className="w-full h-full object-cover grayscale opacity-90 hover:opacity-100 transition-opacity duration-700"
                   alt="business team collaborating on contract documents with laptop and papers"
                   src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&sat=-100"
                 />
               </div>

              {/* Feature Cards */}
              <div className="space-y-4">
                <div className="bg-stone-900 text-white p-6 rounded-lg border border-stone-700/30 hover:border-stone-600/50 transition-all">
                  <span className="material-symbols-outlined text-2xl text-tertiary-fixed mb-4 inline-block">contract</span>
                  <h3 className="font-headline font-bold text-lg mb-2">Contract-First Design</h3>
                  <p className="text-stone-300 text-sm">Built specifically for B2B contracting workflows, not retrofitted from generic solutions.</p>
                </div>

                <div className="bg-surface-container-low p-6 rounded-lg border border-stone-200/30 hover:border-stone-200/60 transition-all">
                  <span className="material-symbols-outlined text-2xl text-primary mb-4 inline-block">verified_user</span>
                  <h3 className="font-headline font-bold text-lg mb-2">Institutional Trust</h3>
                  <p className="text-on-surface-variant text-sm">Used by leading corporations and financial institutions worldwide for mission-critical agreements.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section - SEMANTIC REPOSITORY ANCHOR */}
        <section id="semantic-repository" className="px-8 py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 tracking-tight">Semantic Repository</h2>
              <p className="text-on-surface-variant leading-relaxed">Our AI-driven repository indexes every clause, ensuring immediate retrieval of critical legal obligations and performance triggers across your entire portfolio.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-8 border border-stone-200/30 hover:shadow-lg transition-all">
                <span className="material-symbols-outlined text-4xl text-primary mb-6">description</span>
                <h3 className="font-headline font-bold text-lg mb-3">Auto-Indexing</h3>
                <p className="text-sm text-on-surface-variant">Every contract is automatically indexed and categorized using advanced AI algorithms for lightning-fast retrieval.</p>
              </div>

              <div className="bg-white rounded-lg p-8 border border-stone-200/30 hover:shadow-lg transition-all">
                <span className="material-symbols-outlined text-4xl text-primary mb-6">optical_character_recognition</span>
                <h3 className="font-headline font-bold text-lg mb-3">OCR Ready</h3>
                <p className="text-sm text-on-surface-variant">Convert scanned documents into searchable, indexed contract data in seconds.</p>
              </div>

              <div className="bg-white rounded-lg p-8 border border-stone-200/30 hover:shadow-lg transition-all">
                <span className="material-symbols-outlined text-4xl text-primary mb-6">database</span>
                <h3 className="font-headline font-bold text-lg mb-3">Central Repository</h3>
                <p className="text-sm text-on-surface-variant">One unified source of truth for all your B2B contracts and agreements.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section - ENCRYPTED COMPLIANCE ANCHOR */}
        <section id="security" className="px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 tracking-tight">Encrypted Compliance</h2>
              <p className="text-on-surface-variant leading-relaxed">Institutional-grade security layers protect your most sensitive strategic data. SOC2 Type II certified and GDPR compliant as standard.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-stone-900 text-white p-12 rounded-lg border border-stone-700/30">
                <span className="material-symbols-outlined text-4xl text-tertiary-fixed mb-6 inline-block">shield</span>
                <h3 className="text-2xl font-headline font-bold mb-4">Enterprise-Grade Protection</h3>
                <p className="text-stone-300 mb-6 leading-relaxed">Every byte of your contract data is encrypted using military-grade algorithms. Our infrastructure undergoes quarterly third-party security audits and maintains SOC2 Type II certification.</p>
                <div className="flex flex-col gap-3">
                  <a className="text-sm font-bold text-tertiary-fixed hover:text-tertiary-fixed/80 transition-colors inline-flex items-center gap-1" href="#security">View Security Protocol →</a>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-surface-container-lowest p-6 rounded-lg border border-stone-200/30">
                  <span className="material-symbols-outlined text-xl text-primary mb-4 inline-block">verified</span>
                  <h4 className="font-headline font-bold mb-2">SOC2 Type II</h4>
                  <p className="text-xs text-on-surface-variant">Audited & certified</p>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-lg border border-stone-200/30">
                  <span className="material-symbols-outlined text-xl text-primary mb-4 inline-block">lock</span>
                  <h4 className="font-headline font-bold mb-2">AES-256 Encryption</h4>
                  <p className="text-xs text-on-surface-variant">Military-grade standard</p>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-lg border border-stone-200/30">
                  <span className="material-symbols-outlined text-xl text-primary mb-4 inline-block">public</span>
                  <h4 className="font-headline font-bold mb-2">GDPR Compliant</h4>
                  <p className="text-xs text-on-surface-variant">EU data protection</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marketplace Insights - ANALYTICS ANCHOR */}
        <section id="marketplace-insights" className="px-8 py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 tracking-tight">Marketplace Insights</h2>
              <p className="text-on-surface-variant leading-relaxed">Real-time benchmarking against industry-standard contract terms and pricing models.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-8 border border-stone-200/30">
                <span className="material-symbols-outlined text-4xl text-primary mb-6">analytics</span>
                <h3 className="text-2xl font-headline font-bold mb-4">Real-Time Analytics</h3>
                <p className="text-on-surface-variant mb-6 leading-relaxed">Get competitive intelligence on market trends, pricing benchmarks, and industry standards instantly.</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2"><span className="text-primary">✓</span> Industry pricing models</li>
                  <li className="flex gap-2"><span className="text-primary">✓</span> Contract trend analysis</li>
                  <li className="flex gap-2"><span className="text-primary">✓</span> Competitive benchmarking</li>
                  <li className="flex gap-2"><span className="text-primary">✓</span> Market forecasting</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-8 border border-stone-200/30">
                <span className="material-symbols-outlined text-4xl text-primary mb-6">assessment</span>
                <h3 className="text-2xl font-headline font-bold mb-4">Risk Assessment</h3>
                <p className="text-on-surface-variant mb-6 leading-relaxed">Identify risky clauses and unfavorable terms before signing by comparing against market standards.</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2"><span className="text-primary">✓</span> Clause risk scoring</li>
                  <li className="flex gap-2"><span className="text-primary">✓</span> Term recommendations</li>
                  <li className="flex gap-2"><span className="text-primary">✓</span> Negotiation strategies</li>
                  <li className="flex gap-2"><span className="text-primary">✓</span> Historical comparisons</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Version Lineage & Instant Execution - ADDITIONAL FEATURES */}
        <section id="features" className="px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 tracking-tight">Additional Features</h2>
              <p className="text-on-surface-variant leading-relaxed">Everything you need for professional B2B contract management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-container-lowest p-8 rounded-lg border border-stone-200/30 hover:shadow-lg transition-all">
                <span className="material-symbols-outlined text-4xl text-primary mb-6">history</span>
                <h3 className="font-headline font-bold text-xl mb-3">Version Lineage</h3>
                <p className="text-on-surface-variant mb-6">Complete immutable history of every negotiation touchpoint and redline adjustment.</p>
                <a href="#features" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">Learn more →</a>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-lg border border-stone-200/30 hover:shadow-lg transition-all">
                <span className="material-symbols-outlined text-4xl text-primary mb-6">bolt</span>
                <h3 className="font-headline font-bold text-xl mb-3">Instant Execution</h3>
                <p className="text-on-surface-variant mb-6">Seamless digital signatures with integrated identity verification for finalization.</p>
                <a href="#features" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">Learn more →</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 py-24 mb-24">
          <div className="max-w-7xl mx-auto rounded-lg bg-stone-900 text-white p-12 md:p-24 relative overflow-hidden text-center">
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter">
                Ready to Transform Your Contracts?
              </h2>
              <p className="text-stone-300 text-lg">
                Join leading institutions using Dossier to streamline their B2B contracting process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/register" className="inline-block">
                  <button className="bg-gradient-to-br from-tertiary-fixed to-tertiary-fixed/80 hover:opacity-90 transition-opacity duration-200 text-white px-10 py-5 font-headline font-bold rounded-lg shadow-lg">
                    Get Started
                  </button>
                </Link>
                <Link to="/login" className="inline-block">
                  <button className="bg-white border border-white/50 text-stone-900 px-10 py-5 font-headline font-bold rounded-lg hover:bg-stone-50 transition-colors">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary-container/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
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
            <Link to="/about" className="text-stone-400 hover:text-stone-900 transition-all">About</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
