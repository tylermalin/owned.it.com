import { Nav } from '@/components/Nav';
import Link from 'next/link';
import { Metadata } from 'next';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { ScrollTriggerPopup } from '@/components/ScrollTriggerPopup';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import { SavingsButton } from '@/components/SavingsButton';

// Crypto-native creator commerce. Get paid onchain without platform risk.

export const metadata: Metadata = {
  title: "OWNED: Deploy Your Sovereign Creator Store on Base | 3% Fees, Instant Settlement, Zero Custody Risk",
  description: "Deploy your own creator storefront smart contract on Base. Accept USDC instantly, sell directly to your audience. 3% fees, no middlemen, no custody risk. Own your infrastructure, not rent it.",
  openGraph: {
    title: "OWNED: Deploy Your Sovereign Creator Store on Base",
    description: "Deploy your own creator storefront smart contract on Base. Accept USDC instantly, sell directly to your audience. 3% fees, no middlemen, no custody risk.",
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
            Build Your Store.<br />
            Sell Anywhere.<br />
            <span className="text-primary italic font-serif">Own Everything.</span>
          </h1>

          <div className="space-y-6 mb-20">
            <p className="text-2xl md:text-3xl text-foreground font-bold tracking-tight">The first creator commerce protocol you actually own.</p>
            <p className="max-w-3xl mx-auto text-xl text-muted-foreground font-medium italic leading-relaxed">
              Deploy your storefront smart contract on Base, accept USDC instantly, and sell directly to your audience—without platforms, permission, or deplatforming risk.
            </p>
            <div className="flex flex-col items-center gap-3 pt-4">
              {[
                "No middlemen holding your funds",
                "No account freezes or policy drift",
                "No subscription rent (own it once, use forever)"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                  <span className="text-primary">✓</span> {benefit}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <Link
              href="/pricing"
              className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-saas hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-center"
            >
              Deploy Your Store ($299)
            </Link>
            <Link
              href="/products"
              className="px-10 py-5 bg-white text-foreground border border-border rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-sm hover:bg-muted transition-all w-full sm:w-auto text-center"
            >
              Read Free Chapter
            </Link>
          </div>

          <div className="flex flex-col items-center gap-4 text-muted-foreground animate-bounce cursor-pointer">
            <div className="text-[10px] font-black uppercase tracking-[0.3em]">Watch how it works (60 seconds)</div>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 8l-6 6-6-6" />
            </svg>
          </div>
        </div>
      </main>

      {/* Social Proof Section */}
      <section className="py-32 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight italic text-foreground">Trusted by Sovereign Builders</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <div className="p-12 bg-white rounded-[3.5rem] border border-border shadow-saas space-y-8 italic relative group hover:border-primary transition-all">
              <p className="text-2xl font-medium leading-relaxed text-foreground text-balance">
                "My store processed $8K in the first 30 days. I own the contract. I own the code. I own the customer relationships. This is what sovereignty looks like in practice."
              </p>
              <div className="flex items-center gap-6 not-italic pt-6 border-t border-border/50">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl font-black">TM</div>
                <div>
                  <div className="text-xl font-black text-foreground">Tyler Malin</div>
                  <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">Founder (Building on OWNED)</div>
                </div>
              </div>
            </div>

            <div className="p-12 bg-white rounded-[3.5rem] border border-border shadow-saas space-y-8 italic relative group hover:border-primary transition-all">
              <p className="text-2xl font-medium leading-relaxed text-foreground text-balance">
                "I was paying Gumroad 10%. Now I pay 3% and own the infrastructure. The break-even was 28 days. Everything after that is pure savings."
              </p>
              <div className="flex items-center gap-6 not-italic pt-6 border-t border-border/50">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl font-black">SB</div>
                <div>
                  <div className="text-xl font-black text-foreground">Sovereign Builder</div>
                  <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">Early Adopter</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-[4rem] p-16 md:p-24 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="text-center mb-16 relative">
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-[0.3em] text-primary italic">Live Protocol Stats</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative">
              {[
                { label: "Protocol Fee", value: "3%", sub: "Fixed Forever" },
                { label: "Settlement", value: "< 2s", sub: "Instant USDC" },
                { label: "Custody Risk", value: "Zero", sub: "Non-Custodial" },
                { label: "Account Freezes", value: "Zero", sub: "Impossible" }
              ].map((stat, i) => (
                <div key={i} className="text-center space-y-3">
                  <div className="text-5xl md:text-7xl font-black italic tracking-tighter text-white">{stat.value}</div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-primary">{stat.label}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.sub}</div>
                </div>
              ))}
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
                  <span className="text-primary">•</span> Your store lives onchain (not on our servers)
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> You control pricing & products (no platform approval needed)
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Media & metadata on IPFS (permanent storage)
                </li>
              </ul>
              <div className="pt-4 text-[10px] font-black uppercase tracking-widest text-primary italic">
                OWNED never takes custody of your funds.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-12 rounded-[3.5rem] border border-border shadow-saas space-y-8 group hover:border-primary transition-all">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl font-black">2</div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight">Sell Anywhere</h3>
                <p className="text-lg text-muted-foreground font-medium italic leading-relaxed">
                  Your store isn't locked to a single platform. Sell wherever your audience is.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-muted-foreground text-center">X Threads</div>
                <div className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-muted-foreground text-center">Discord</div>
                <div className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-muted-foreground text-center">Base Apps</div>
                <div className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-muted-foreground text-center">Direct DMs</div>
              </div>
              <div className="pt-4 text-[10px] font-black uppercase tracking-widest text-primary italic text-center">
                Your store follows your audience, not the other way around.
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
                  <span className="text-primary">•</span> Contracts are truly yours (deployed to your wallet)
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Real-time settlement (USDC hits your wallet instantly)
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Censorship resistant (code doesn't have policies)
                </li>
              </ul>
              <div className="pt-4 text-[10px] font-black uppercase tracking-widest text-primary italic">
                Works even if OWNED disappears tomorrow.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: What makes OWNED different */}
      <section className="py-32 bg-slate-900 text-white rounded-[4rem] md:rounded-[6rem] mx-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-20">
            <div className="space-y-8 text-center lg:text-left">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                What makes <br /><span className="text-primary italic font-serif">OWNED</span> different?
              </h2>
              <p className="text-2xl text-slate-400 font-medium italic leading-relaxed text-balance">
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

          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight italic">See the Difference</h2>
            <p className="text-xl text-slate-400 font-medium italic">Most platforms extract rent as you grow. We charge for tools, not permission.</p>
          </div>

          <div className="overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-8 text-xs font-black uppercase tracking-widest text-slate-400">Feature</th>
                    <th className="p-8 text-center text-xs font-black uppercase tracking-widest text-slate-400">Gumroad</th>
                    <th className="p-8 text-center text-xs font-black uppercase tracking-widest text-slate-400">Shopify</th>
                    <th className="p-8 text-center text-xs font-black uppercase tracking-widest text-primary bg-primary/5">OWNED</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { feature: "Platform Fee", gumroad: "10% forever", shopify: "2.9% + 30¢ + monthly", owned: "3% flat" },
                    { feature: "Settlement Time", gumroad: "7-30 days", shopify: "2-7 days", owned: "Instant" },
                    { feature: "Who Holds Your Funds", gumroad: "Gumroad", shopify: "Stripe", owned: "You" },
                    { feature: "Account Freeze Risk", gumroad: "High", shopify: "High", owned: "Impossible" },
                    { feature: "You Own the Code", gumroad: "❌", shopify: "❌", owned: "✅" },
                    { feature: "You Own Customer Data", gumroad: "❌", shopify: "⚠️ Limited", owned: "✅" },
                    { feature: "Works if Platform Dies", gumroad: "❌", shopify: "❌", owned: "✅" }
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="p-8 font-bold text-slate-200">{row.feature}</td>
                      <td className="p-8 text-center text-slate-400">{row.gumroad}</td>
                      <td className="p-8 text-center text-slate-400">{row.shopify}</td>
                      <td className="p-8 text-center font-black text-primary bg-primary/5">{row.owned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-12 text-center">
            <SavingsButton />
          </div>
        </div>
      </section>

      <SavingsCalculator />

      {/* What can I sell section */}
      <section className="py-32 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight italic text-foreground text-balance leading-tight">What Can You Sell That You Actually <span className="text-primary">OWN?</span></h2>
            <p className="text-xl text-muted-foreground font-medium tracking-wide italic text-balance">OWNED isn't just another creator platform. It's infrastructure that unlocks capabilities impossible on legacy platforms.</p>
          </div>

          <div className="space-y-12">
            {[
              {
                title: "💎 Transferable Access",
                desc: "Sell a course as an NFT. The buyer owns it forever. They can resell it on secondary markets. You earn royalties on every resale.",
                cant: "You can't do this on Teachable.",
                example: "Sell a $297 course. Buyer graduates and resells for $200. You earn 10% ($20) automatically. Forever."
              },
              {
                title: "🎟️ Unforgeable Tickets",
                desc: "Onchain event tickets. Cryptographically verifiable. Tradeable on secondary markets. No Ticketmaster fees.",
                cant: "StubHub charges 25%. You charge 3%.",
                example: "Sell 100 conference tickets at $497 each. Earn $1,491 in royalties when 30% resell on secondary markets."
              },
              {
                title: "🤖 Wallet-Based Agent Access",
                desc: "Sell AI agent usage tied to wallet ownership. No API keys to manage. No account logins. Pure cryptographic access.",
                cant: "This doesn't exist on legacy platforms.",
                example: "Sell access to your trading bot. No passwords to reset. No account management overhead. Access = ownership."
              },
              {
                title: "🎵 Music With Perpetual Royalties",
                desc: "Sell your song. Set 10% resale royalties. Every time it trades, you get paid. Forever. Onchain proof.",
                cant: "Spotify pays $0.003 per stream. You set your price.",
                example: "Sell a song for $10. It trades 50 times over 5 years. You earn $50 in royalties on top of the initial $10."
              },
              {
                title: "📚 Permanent Digital Assets",
                desc: "Your ebook lives on IPFS. The contract lives on Base. Even if OWNED shuts down tomorrow, your customers still have access.",
                cant: "Gumroad can delete your account. This can't be deleted.",
                example: "Your business outlasts the platform. That's not a feature. That's a paradigm shift."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-border shadow-saas space-y-8 group hover:border-primary transition-all">
                <h3 className="text-3xl font-black tracking-tight">{item.title}</h3>
                <p className="text-xl text-muted-foreground font-medium italic leading-relaxed">{item.desc}</p>
                <div className="py-2 px-4 bg-red-50 text-red-600 inline-block rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">{item.cant}</div>
                <div className="pt-8 border-t border-border/50 text-base font-medium text-foreground italic flex flex-col gap-3">
                  <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] not-italic">Economic Impact:</span>
                  {item.example}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <div className="inline-flex flex-wrap justify-center gap-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Need inspiration?</div>
              <Link href="/products" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">See Tyler's Store →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Not Ready to Deploy Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight italic text-foreground">Not Ready to Deploy? Start Here.</h2>
            <p className="text-xl text-muted-foreground font-medium tracking-wide">Choose your path to sovereign commerce:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Guide */}
            <div className="bg-white p-12 rounded-[3.5rem] border border-border shadow-saas space-y-8 group hover:border-primary transition-all">
              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Learn the Framework First</div>
                <h3 className="text-3xl font-black tracking-tight">The Definitive Guide</h3>
                <p className="text-4xl font-black italic">$97</p>
                <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">
                  108 pages. 21 chapters. The complete blueprint for sovereign commerce infrastructure.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-border/50">
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Infrastructure & Sovereignty
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Product Architecture
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Distribution Systems
                </li>
              </ul>
              <div className="flex flex-col gap-4">
                <Link href="/products/2/checkout" className="block w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-center shadow-saas">Get the Guide →</Link>
                <Link href="/products/6/checkout" className="block w-full py-4 bg-slate-50 text-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-center">Read Chapter 1 Free →</Link>
              </div>
            </div>

            {/* Strategy Session */}
            <div className="bg-white p-12 rounded-[3.5rem] border border-border shadow-saas space-y-8 group hover:border-primary transition-all">
              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Get Expert Guidance</div>
                <h3 className="text-3xl font-black tracking-tight">Strategy Session</h3>
                <p className="text-4xl font-black italic">$297</p>
                <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">
                  60 minutes with founder Tyler Malin. Map your path from platform to protocol.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-border/50">
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Store architecture review
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Launch strategy & timeline
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> 7 days of follow-up support
                </li>
              </ul>
              <Link href="/products/1/checkout" className="block w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-center shadow-saas">Book Session →</Link>
              <div className="text-center text-[10px] font-black uppercase tracking-widest text-primary italic">Only 5 slots left this month.</div>
            </div>

            {/* Community */}
            <div className="bg-white p-12 rounded-[3.5rem] border border-border shadow-saas space-y-8 group hover:border-primary transition-all">
              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Join the Community</div>
                <h3 className="text-3xl font-black tracking-tight">Builders Circle</h3>
                <p className="text-4xl font-black italic">$47<span className="text-sm font-medium">/mo</span></p>
                <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">
                  Weekly live calls. Private Discord. Template library. Priority support.
                </p>
              </div>
              <ul className="space-y-2 pt-4 border-t border-border/50">
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Weekly 45-min builder calls
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> Token-gated private Discord
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                  <span className="text-primary">•</span> 10% off strategy sessions
                </li>
              </ul>
              <Link href="/register" className="block w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-center shadow-saas">Join Community →</Link>
              <div className="text-center text-[10px] font-black uppercase tracking-widest text-primary italic">47 founding spots remaining.</div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/pricing" className="text-sm font-black uppercase tracking-widest text-primary hover:underline underline-offset-8 transition-all">
              Ready to deploy? Skip learning and launch your store → ($299)
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA / Closing Section */}
      <section className="py-48 bg-slate-900 text-white rounded-[4rem] md:rounded-[6rem] mx-6 mb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-tight">Ready to Stop Renting <br />Your Business?</h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium italic max-w-3xl mx-auto leading-relaxed">Choose your path to sovereign commerce:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
            {[
              { title: "🚀 Start Building Now", sub: "Deploy Your Store", price: "$299 one-time", desc: "Smart contract on Base. IPFS storefront. USDC settlement. Yours forever.", cta: "Deploy Store →", href: "/pricing" },
              { title: "📚 Start Learning First", sub: "The Definitive Guide", price: "$97", desc: "108 pages. 21 chapters. The technical and strategic blueprint.", cta: "Buy Full Guide →", href: "/products/2/checkout" },
              { title: "💬 Start With Guidance", sub: "Strategy Session", price: "$297", desc: "60 minutes with me. Map your specific path from platform to protocol.", cta: "Book Session →", href: "/products/1/checkout" },
              { title: "🤝 Start With Community", sub: "Builders Circle", price: "$47/month", desc: "Weekly calls. Private Discord. Templates. Priority support.", cta: "Join Community →", href: "/register" }
            ].map((card, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-sm flex flex-col group hover:bg-white/10 transition-all">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">{card.title}</div>
                <h3 className="text-2xl font-black tracking-tight mb-2">{card.sub}</h3>
                <div className="text-2xl font-black italic text-primary mb-6">{card.price}</div>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 flex-1">{card.desc}</p>
                <Link href={card.href} className="block w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-center shadow-saas group-hover:scale-105 transition-all">{card.cta}</Link>
              </div>
            ))}
          </div>

          <div className="pt-24 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <h4 className="text-xl font-bold italic">Still Not Convinced?</h4>
              <p className="text-sm text-slate-400">The infrastructure platforms don't want you to know about.</p>
            </div>
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-primary">Read Chapter 1 (free)</div>
              <Link href="/products/6/checkout" className="text-sm font-bold text-white hover:text-primary transition-colors hover:underline underline-offset-4">Download Free Chapter →</Link>
            </div>
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-primary">Watch a demo (2 min)</div>
              <Link href="#" className="text-sm font-bold text-white hover:text-primary transition-colors hover:underline underline-offset-4">See deployment in action →</Link>
            </div>
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-primary">Ask questions</div>
              <Link href="https://x.com/owneditxyz" className="text-sm font-bold text-white hover:text-primary transition-colors hover:underline underline-offset-4">DM me on X →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border bg-white mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <img src="/assets/logo.png" alt="OWNED" className="w-[150px] h-[150px] object-contain opacity-80" />
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all">
            <Link href="/pricing" className="hover:text-primary transition-colors text-primary">Pricing</Link>
            <Link href="/investors" className="hover:text-primary transition-colors">Investors</Link>
            <Link href="https://x.com/owneditxyz" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          </div>
          <p className="text-sm text-muted-foreground font-medium">© 2026 OWNED · IT</p>
        </div>
      </footer>
      <ExitIntentPopup />
      <ScrollTriggerPopup />
    </div>
  );
}
