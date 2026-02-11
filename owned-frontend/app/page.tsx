import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  other: {
    'base:app_id': '698bc660f5cfc733257240f2',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-[10px] flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center py-2">
              <img src="/assets/logo.png" alt="OWNED" className="w-[150px] h-[150px] object-contain hover:scale-105 transition-transform" />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
              <Link href="#solutions" className="hover:text-foreground transition-colors">Solutions</Link>
              <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-48 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            NOW LIVE ON BASE
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 text-balance">
            Sell Your Knowledge <br className="hidden md:block" />
            <span className="text-primary italic">Direct</span> to Your Audience
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10 text-balance font-medium leading-relaxed">
            Effortlessly manage your digital products, coaching, and memberships with crypto-native simplicity. No subscriptions. No platform risk.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-saas hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-center"
            >
              Get Started Free
            </Link>
            <a
              href="/products"
              className="px-8 py-4 bg-white text-foreground border border-border rounded-2xl font-bold text-lg shadow-sm hover:bg-muted transition-all w-full sm:w-auto text-center"
            >
              View Demo Store
            </a>
          </div>

          {/* Dashboard Mockup Placeholder */}
          <div className="relative max-w-5xl mx-auto px-4 mt-20">
            <div className="rounded-3xl border border-border bg-white shadow-saas-lg overflow-hidden animate-slide-up">
              <div className="bg-muted h-8 border-b border-border flex items-center px-4 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="aspect-[16/9] bg-slate-50 relative overflow-hidden">
                <img
                  src="/assets/dashboard_preview.png"
                  alt="Platform Dashboard Preview"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-12 -left-12 hidden lg:block animate-bounce-slow">
              <div className="p-4 bg-white rounded-2xl shadow-saas-lg border border-border flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Sale</p>
                  <p className="text-sm font-bold">$199.00 USDC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Bento Grid */}
      <section id="features" className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Everything you need to grow</h2>
            <p className="text-xl text-muted-foreground font-medium">Forget complex project management tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="md:col-span-2 bg-white p-10 rounded-4xl border border-border shadow-saas hover:shadow-saas-lg transition-all group">
              <div className="flex flex-col h-full justify-between gap-8">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">Smart Storefronts</h3>
                  <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                    Deploy your own smart contract in seconds. You own the code, you own the store, you own the relationship.
                  </p>
                </div>
                <div className="aspect-video bg-muted rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                  {/* Placeholder for visual */}
                </div>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="bg-primary p-10 rounded-4xl text-primary-foreground shadow-saas flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold">Instant Payments</h3>
                <p className="text-lg opacity-80 font-medium">USDC goes directly to your wallet. No 30-day holds. No withdrawal limits.</p>
              </div>
              <div className="text-6xl font-black italic opacity-20 text-right">97%</div>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-4xl border border-border shadow-saas flex flex-col justify-between group">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">IPFS Fulfillment</h3>
                <p className="text-muted-foreground font-medium">Securely deliver digital files via decentralized storage. Censorship resistant.</p>
              </div>
              <div className="h-32 bg-muted rounded-2xl mt-8 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
              </div>
            </div>
            {/* Feature 4 */}
            <div className="md:col-span-2 bg-white p-10 rounded-4xl border border-border shadow-saas flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <h3 className="text-3xl font-bold">Editorial Checkout</h3>
                <p className="text-lg text-muted-foreground font-medium">A high-conversion checkout experience that looks like a luxury magazine. Optimized for trust.</p>
              </div>
              <div className="w-full md:w-1/2 aspect-[16/9] bg-slate-50 rounded-2xl overflow-hidden border border-border shadow-sm relative">
                <img
                  src="/assets/checkout_preview.png"
                  alt="Editorial Checkout Preview"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Fair, transparent pricing</h2>
            <p className="text-xl text-muted-foreground font-medium">Stack sats, not subscriptions.</p>
          </div>

          <div className="max-w-md mx-auto bg-white p-12 rounded-4xl border-2 border-primary shadow-saas-lg space-y-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded">MOST POPULAR</div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-muted-foreground">Standard Creator</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black italic">$9</span>
                <span className="text-muted-foreground font-medium">/month</span>
              </div>
            </div>
            <ul className="space-y-4 text-lg font-medium">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                3% Transaction Fee
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Unlimited Products
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Fees Cap at $100/mo
              </li>
            </ul>
            <Link
              href="/dashboard"
              className="block w-full py-4 bg-primary text-primary-foreground text-center rounded-2xl font-bold shadow-saas hover:scale-105 active:scale-95 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <img src="/assets/logo.png" alt="OWNED" className="w-[150px] h-[150px] object-contain opacity-80" />
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#">Twitter</Link>
            <Link href="#">Discord</Link>
            <Link href="#">Terms</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 OWNED · IT</p>
        </div>
      </footer>
    </div>
  );
}
