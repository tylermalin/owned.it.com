import { Nav } from '@/components/Nav';
import Link from 'next/link';
import { Metadata } from 'next';

// Crypto-native creator commerce. Get paid onchain without platform risk.

export const metadata: Metadata = {
  title: "OWNED IT - Stack sats, not subscriptions",
  description: "Crypto-native creator commerce. Get paid onchain without platform risk.",
  openGraph: {
    title: "OWNED IT",
    description: "Sell your knowledge direct to your audience.",
    images: ["https://ownedit.xyz/assets/logo.png"],
  },
  other: {
    'base:app_id': '698bc660f5cfc733257240f2',
    'fc:miniapp': JSON.stringify({
      version: "next",
      imageUrl: "https://ownedit.xyz/assets/logo.png",
      button: {
        title: "Launch App",
        action: {
          type: "launch_miniapp",
          name: "OWNED IT",
          url: "https://ownedit.xyz"
        }
      }
    }),
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Nav */}
      <Nav />

      {/* Hero Section */}
      <main className="relative pt-48 pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-12 animate-fade-in border border-primary/10">
            NOW LIVE ON BASE
          </div>

          <h1 className="text-6xl md:text-[7rem] font-black tracking-tighter text-foreground mb-8 text-balance leading-[0.9]">
            Build your store.<br />
            Sell anywhere.<br />
            <span className="text-primary italic font-serif">Own everything.</span>
          </h1>

          <div className="space-y-4 mb-20">
            <p className="text-2xl md:text-3xl text-foreground font-bold tracking-tight">Crypto-native commerce on Base.</p>
            <p className="max-w-3xl mx-auto text-xl text-muted-foreground font-medium italic leading-relaxed">
              Deploy your own onchain storefront, accept USDC instantly, and sell directly to your audience—without platforms, permission, or lock-in.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/pricing"
              className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-saas hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-center"
            >
              Start Selling
            </Link>
            <Link
              href="/products"
              className="px-10 py-5 bg-white text-foreground border border-border rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-sm hover:bg-muted transition-all w-full sm:w-auto text-center"
            >
              View Demo Store
            </Link>
          </div>
        </div>
      </main>

      {/* Platform Overview */}
      <section className="py-32 bg-slate-50/50 border-y border-border">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-4">
            <div className="text-4xl md:text-6xl font-black tracking-tighter">
              Build your store. Sell anywhere. Own everything.
            </div>
            <p className="text-2xl text-muted-foreground font-medium italic max-w-3xl mx-auto leading-relaxed">
              OWNED is a crypto-native commerce protocol for creators who want control, not platforms.
            </p>
          </div>
          <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-border shadow-saas text-xl md:text-2xl font-medium leading-relaxed italic text-foreground text-balance">
            "You deploy your own onchain store, sell directly to your audience, and keep ownership of your <span className="text-primary font-black not-italic">code, content, and customer relationships.</span>"
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary" /> No middlemen
            </div>
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary" /> No lock-in
            </div>
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary" /> No permission required
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / 3-Step Model */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight italic text-foreground">How OWNED Works</h2>
            <p className="text-xl text-muted-foreground font-medium tracking-wide">Infrastructure, not just a page.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-12 rounded-[3.5rem] border border-border shadow-saas space-y-8 group hover:border-primary transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl font-black">1</div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight">Build Your Store</h3>
                <p className="text-lg text-muted-foreground font-medium italic leading-relaxed">
                  Deploy your own storefront smart contract on Base in minutes.
                </p>
              </div>
              <ul className="space-y-3 pt-4 border-t border-border/50">
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Your store lives onchain
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> You control pricing & products
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Media & metadata on IPFS
                </li>
              </ul>
              <div className="pt-4 text-[10px] font-black uppercase tracking-widest text-primary italic">
                OWNED never takes custody.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-12 rounded-[3.5rem] border border-border shadow-saas space-y-8 group hover:border-primary transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl font-black">2</div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight">Sell Anywhere</h3>
                <p className="text-lg text-muted-foreground font-medium italic leading-relaxed">
                  Your store is not tied to a single platform. Sell wherever your audience is.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-muted-foreground text-center">X Threads</div>
                <div className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-muted-foreground text-center">Discord</div>
                <div className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-muted-foreground text-center">Base Apps</div>
                <div className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-muted-foreground text-center">Direct DMs</div>
              </div>
              <div className="pt-4 text-[10px] font-black uppercase tracking-widest text-primary italic text-center">
                Your store follows your audience.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-12 rounded-[3.5rem] border border-border shadow-saas space-y-8 group hover:border-primary transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl font-black">3</div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight">Own Everything</h3>
                <p className="text-lg text-muted-foreground font-medium italic leading-relaxed">
                  You don't rent access. You own the underlying infrastructure.
                </p>
              </div>
              <ul className="space-y-3 pt-4 border-t border-border/50">
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Contracts are truly yours
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Real-time settlement
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Censorship resistant
                </li>
              </ul>
              <div className="pt-4 text-[10px] font-black uppercase tracking-widest text-primary italic">
                Works even if OWNED disappears.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: What makes OWNED different */}
      <section className="py-32 bg-slate-900 text-white rounded-[4rem] md:rounded-[6rem] mx-6">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              What makes <br /><span className="text-primary italic font-serif">OWNED</span> different?
            </h2>
            <p className="text-2xl text-slate-400 font-medium italic leading-relaxed">
              Most creator tools give you a page. We give you infrastructure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
              <h4 className="text-xl font-bold italic">No account freezes</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">Smart contracts don't have "lock" buttons. Your store responds only to you.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
              <h4 className="text-xl font-bold italic">No payment holds</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">USDC settles directly to your wallet. Not our bank account.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
              <h4 className="text-xl font-bold italic">No deplatforming</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">Sovereign code cannot be deleted by a centralized admin.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
              <h4 className="text-xl font-bold italic">No subscription traps</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">Own it once, use it forever. Pay for tools, not permission.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bridge */}
      <section className="py-48 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Built as protocol, delivered with <span className="text-primary italic">professional</span> tooling.
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium italic leading-relaxed max-w-3xl mx-auto">
              Use OWNED as pure infrastructure, or unlock our dashboard, analytics, and fulfillment tools when you want convenience—without giving up ownership.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-block px-12 py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.3em] shadow-saas hover:scale-105 active:scale-95 transition-all"
          >
            Explore the Stack
          </Link>
        </div>
      </section>

      {/* What can I sell section */}
      <section className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight italic text-foreground">What can I sell?</h2>
            <p className="text-xl text-muted-foreground font-medium tracking-wide italic">Digital sovereignty for every type of creator.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8 mb-24">
            {[
              "Courses", "Digital Goods", "Memberships", "Tickets",
              "Songs", "Videos", "AI Prompts", "AI Agents",
              "CopyTrade Access", "Consulting", "Merch", "And More"
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex items-center justify-center text-center group hover:border-primary hover:shadow-saas transition-all">
                <span className="text-sm font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 rounded-[4rem] p-12 md:p-16 border border-primary/10 text-center space-y-8 max-w-4xl mx-auto">
            <p className="text-2xl text-foreground font-medium italic">"Need ideas? Start your journey with the ultimate creator resource."</p>
            <Link
              href="/products"
              className="inline-block px-12 py-6 bg-foreground text-background rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-saas hover:scale-105 active:scale-95 transition-all"
            >
              Grab the Definitive Guidebook
            </Link>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Now available on the store</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border bg-white mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <img src="/assets/logo.png" alt="OWNED" className="w-[150px] h-[150px] object-contain opacity-80" />
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all">
            <Link href="/pricing" className="hover:text-primary transition-colors text-primary">Pricing</Link>
            <Link href="https://x.com/owneditxyz" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          </div>
          <p className="text-sm text-muted-foreground font-medium">© 2026 OWNED · IT</p>
        </div>
      </footer>
    </div>
  );
}
