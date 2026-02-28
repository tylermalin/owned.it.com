'use client';

import { useState } from 'react';
import { Nav } from '@/components/Nav';
import Link from 'next/link';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { ScrollTriggerPopup } from '@/components/ScrollTriggerPopup';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import { SavingsButton } from '@/components/SavingsButton';
import { VideoModal } from '@/components/VideoModal';
import { Play, ChevronRight, Star, Quote, ArrowRight, GraduationCap, FileText, Users2, Clock3, Music, MapPin, Sparkles, Link2 } from 'lucide-react';

export function LandingPageClient() {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20">
            {/* Nav */}
            <Nav />

            {/* Hero Section */}
            <main className="relative pt-64 pb-32 overflow-hidden">
                {/* Visual Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-float" />
                <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10 animate-float [animation-delay:2s]" />

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 border border-primary/10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Sovereign Commerce is Here
                    </div>

                    <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter text-foreground mb-12 text-balance leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
                        Build Your Store.<br />
                        <span className="text-primary italic font-serif text-glow">Sell Anywhere.</span><br />
                        Own Everything.
                    </h1>

                    <div className="space-y-8 mb-24 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                        <p className="text-2xl md:text-3xl text-foreground font-bold tracking-tight">The first creator commerce protocol you actually own.</p>
                        <p className="max-w-3xl mx-auto text-xl text-muted-foreground font-medium italic leading-relaxed">
                            Deploy your storefront smart contract on Base, accept USDC instantly, and sell directly to your audience—without platforms, permission, or deplatforming risk.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                        <Link href="/deploy" className="group relative inline-flex items-center gap-4 px-12 py-6 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-sm overflow-hidden shadow-glow hover:scale-[1.05] active:scale-[0.95] transition-all">
                            <span className="relative z-10">Deploy Your Store ($297)</span>
                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </Link>

                        <button
                            onClick={() => setIsVideoModalOpen(true)}
                            className="px-12 py-6 glass text-foreground border border-border rounded-[2rem] font-black uppercase tracking-[0.25em] text-xs shadow-sm hover:bg-white transition-all w-full sm:w-auto text-center flex items-center justify-center gap-4 group"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                                <Play className="w-3.5 h-3.5 fill-current transition-colors group-hover:text-primary" />
                            </div>
                            Watch Demo
                        </button>
                    </div>

                    <div
                        onClick={() => setIsVideoModalOpen(true)}
                        className="flex flex-col items-center gap-6 text-muted-foreground animate-bounce-slow cursor-pointer group animate-in fade-in duration-1000 delay-700"
                    >
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] group-hover:text-primary transition-colors">Experience Sovereignty</div>
                        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                            <svg className="w-5 h-5 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 8l-6 6-6-6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </main>

            {/* Social Proof Section */}
            <section className="py-48 bg-slate-50/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-32 space-y-4">
                        <div className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Protocol Proof</div>
                        <h2 className="text-5xl md:text-[6rem] font-black tracking-tight italic text-foreground leading-none">Trusted by Sovereign<br />Builders</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                        <div className="group p-16 glass rounded-[4rem] shadow-saas-lg space-y-12 italic relative hover:scale-[1.02] transition-all duration-500">
                            <Quote className="w-12 h-12 text-primary/20 absolute top-12 left-10" />
                            <p className="text-3xl font-medium leading-[1.4] text-foreground text-balance relative">
                                "My store processed $8K in the first 30 days. I own the contract. I own the code. I own the customer relationships. This is what sovereignty looks like in practice."
                            </p>
                            <div className="flex items-center gap-8 not-italic pt-12 border-t border-border">
                                <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-white text-2xl font-black shadow-glow">TM</div>
                                <div>
                                    <div className="text-2xl font-black text-foreground">Tyler Malin</div>
                                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Founder @ OWNED</div>
                                </div>
                            </div>
                        </div>

                        <div className="group p-16 glass rounded-[4rem] shadow-saas-lg space-y-12 italic relative hover:scale-[1.02] transition-all duration-500">
                            <Quote className="w-12 h-12 text-primary/20 absolute top-12 left-10" />
                            <p className="text-3xl font-medium leading-[1.4] text-foreground text-balance relative">
                                "I was paying Gumroad 10%. Now I pay 3% and own the infrastructure. The break-even was 28 days. Everything after that is pure savings."
                            </p>
                            <div className="flex items-center gap-8 not-italic pt-12 border-t border-border">
                                <div className="w-20 h-20 bg-slate-200 rounded-[2rem] flex items-center justify-center text-slate-600 text-2xl font-black">SB</div>
                                <div>
                                    <div className="text-2xl font-black text-foreground">Sovereign Builder</div>
                                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Early Adopter</div>
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
                        </div>

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
                        </div>

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
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-32 bg-slate-900 text-white rounded-[4rem] md:rounded-[6rem] mx-6">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-20">
                        <div className="space-y-8 text-center lg:text-left">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                                What makes <br /><span className="text-primary italic font-serif">OWNED</span> different?
                            </h2>
                            <p className="text-2xl text-slate-400 font-medium italic leading-relaxed">
                                Most creator tools give you a page. We give you infrastructure.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { h: "No account freezes", p: "Smart contracts don't have lock buttons." },
                                { h: "No payment holds", p: "USDC settles directly to your wallet." },
                                { h: "No deplatforming", p: "Sovereign code cannot be deleted." },
                                { h: "No subscription traps", p: "Own it once, use it forever." }
                            ].map((item, i) => (
                                <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                                    <h4 className="text-xl font-bold italic">{item.h}</h4>
                                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.p}</p>
                                </div>
                            ))}
                        </div>
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
                                        { feature: "Platform Fee", gumroad: "10% forever", shopify: "2.9% + monthly", owned: "3% flat" },
                                        { feature: "Settlement Time", gumroad: "7-30 days", shopify: "2-7 days", owned: "Instant" },
                                        { feature: "Who Holds Your Funds", gumroad: "Gumroad", shopify: "Stripe", owned: "You" },
                                        { feature: "Account Freeze Risk", gumroad: "High", shopify: "High", owned: "Impossible" },
                                        { feature: "You Own the Code", gumroad: "❌", shopify: "❌", owned: "✅" },
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

            {/* Capabilities Section */}
            <section className="py-48 bg-slate-50/50 relative overflow-hidden">
                <div className="absolute top-[20%] left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[20%] right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 space-y-32">
                    <div className="text-center space-y-8 relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/20">
                            <Sparkles className="w-3 h-3" /> Infinite Capabilities
                        </div>
                        <h2 className="text-5xl md:text-[6rem] font-black tracking-tight italic text-foreground leading-[0.95]">
                            Build Your Store with Your <br />
                            <span className="text-primary italic font-serif text-glow">Talent and Skills.</span>
                        </h2>
                        <p className="text-2xl text-muted-foreground font-medium max-w-3xl mx-auto italic leading-relaxed">
                            From digital downloads to global events, OWNED is the infrastructure for everything you create.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                t: "Create a Course",
                                d: "Token-gated video series and curriculum. The buyer owns the access key forever.",
                                icon: <GraduationCap className="w-8 h-8" />,
                                color: "bg-blue-500/10 text-blue-600",
                                example: "The $50k/mo Solopreneur Course"
                            },
                            {
                                t: "Sell A Notion Template",
                                d: "Direct delivery of workspace templates. No platform approval or 30% take rates.",
                                icon: <FileText className="w-8 h-8" />,
                                color: "bg-indigo-500/10 text-indigo-600",
                                example: "Infinite OS Project Management"
                            },
                            {
                                t: "Create a Community",
                                d: "NFT-gated Discord and weekly calls. Instant membership for anyone with the token.",
                                icon: <Users2 className="w-8 h-8" />,
                                color: "bg-emerald-500/10 text-emerald-600",
                                example: "The Sovereignty Circle"
                            },
                            {
                                t: "Sell Your Time",
                                d: "Consulting calls and bootcamp kickoffs. Automated booking and settlement.",
                                icon: <Clock3 className="w-8 h-8" />,
                                color: "bg-amber-500/10 text-amber-600",
                                example: "60-Min Protocol Strategy Session"
                            },
                            {
                                t: "Sell Your Music & Art",
                                d: "Digital collections with built-in perpetual royalties. You are the record label.",
                                icon: <Music className="w-8 h-8" />,
                                color: "bg-rose-500/10 text-rose-600",
                                example: "Sovereign Sound Genesis Drop"
                            },
                            {
                                t: "Virtual or IRL Events",
                                d: "Scalable ticketing for workshops or global meetups. Verifiable on-chain.",
                                icon: <MapPin className="w-8 h-8" />,
                                color: "bg-violet-500/10 text-violet-600",
                                example: "Founder & Team Bootcamp"
                            },
                            {
                                t: "Sell Your Games",
                                d: "Indie games delivered as IPFS downloads or browser links. Truly ownerless distribution.",
                                icon: <Play className="w-4 h-4" />,
                                color: "bg-orange-500/10 text-orange-600",
                                example: "Retro-Sovereign Arcade"
                            },
                            {
                                t: "Link Your Socials",
                                d: "Aggregate your entire digital presence. One link to rule them all.",
                                icon: <Link2 className="w-8 h-8" />,
                                color: "bg-slate-500/10 text-slate-600",
                                example: "The Unified Identity Link"
                            }
                        ].map((item, i) => {
                            const slug = item.t.toLowerCase().replace(/ /g, '-').replace('create-a-', '').replace('sell-a-', '').replace('sell-your-', '').replace('virtual-or-irl-', '').replace('link-your-', '');
                            // Mapping literal words to slugs defined in showcase.ts
                            const slugMap: Record<string, string> = {
                                'course': 'sovereign-course',
                                'notion-template': 'notion-template',
                                'community': 'sovereign-circle',
                                'time': 'strategy-session',
                                'music-&-art': 'sovereign-sound',
                                'events': 'sovereign-bootcamp',
                                'games': 'sovereign-arcade',
                                'socials': 'unified-identity'
                            };
                            const finalSlug = slugMap[slug] || slug;

                            return (
                                <Link
                                    key={i}
                                    href={`/showcase/${finalSlug}`}
                                    className="group bg-white p-12 rounded-[4rem] border border-border shadow-saas hover:border-primary transition-all duration-500 flex flex-col justify-between space-y-12 hover:scale-[1.02] hover:shadow-saas-lg"
                                >
                                    <div className="space-y-8 text-center sm:text-left">
                                        <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto sm:mx-0 group-hover:scale-110 transition-transform`}>
                                            {item.icon}
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-black tracking-tight">{item.t}</h3>
                                            <p className="text-lg text-muted-foreground font-medium italic leading-relaxed">{item.d}</p>
                                        </div>
                                    </div>
                                    <div className="pt-8 border-t border-border/50">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 opacity-50">Bad Ass Example</div>
                                        <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-3">
                                            {item.example} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Start Here Section */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center space-y-24">
                    <h2 className="text-5xl md:text-6xl font-black tracking-tight italic text-foreground">Not Ready to Deploy? Start Here.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {[
                            { t: "The Definitive Guide", p: "$95", d: "108 pages. The complete blueprint for sovereign commerce.", l: "/products/2" },
                            { t: "Strategy Session", p: "$297", d: "60 minutes with Tyler Malin. Map your path to protocol.", l: "/products/1" },
                            { t: "The Builder's Club Membership", p: "$47/mo", d: "Weekly calls. Private Discord. Priority support.", l: "/products/7" }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-border shadow-saas space-y-8">
                                <h3 className="text-3xl font-black tracking-tight">{item.t}</h3>
                                <p className="text-4xl font-black italic text-primary">{item.p}</p>
                                <p className="text-sm text-muted-foreground font-medium italic">{item.d}</p>
                                <Link href={item.l} className="block w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-center">Join Now →</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer / Final CTA */}
            <section className="py-48 bg-slate-900 text-white rounded-[4rem] md:rounded-[6rem] mx-6 mb-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative text-center">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-tight mb-24 text-balance">Ready to Stop Renting <br />Your Business?</h2>
                    <div className="pt-24 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold italic">Still Not Convinced?</h4>
                            <p className="text-sm text-slate-400">Owner-only infrastructure.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-primary">Read Chapter 1</div>
                            <Link href="/products/2" className="text-sm font-bold text-white hover:text-primary transition-colors hover:underline">Download Free →</Link>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-primary">Watch a demo (2 min)</div>
                            <button
                                onClick={() => setIsVideoModalOpen(true)}
                                className="text-sm font-bold text-white hover:text-primary transition-colors hover:underline text-left"
                            >
                                See deployment in action →
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-primary">Ask questions</div>
                            <Link href="https://x.com/owneditxyz" className="text-sm font-bold text-white hover:text-primary transition-colors hover:underline">DM me on X →</Link>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-20 border-t border-border bg-white text-center">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                    <img src="/assets/logo.png" alt="OWNED" className="h-[100px] w-auto opacity-50" />
                    <div className="flex gap-8">
                        <Link href="/pricing">Pricing</Link>
                        <Link href="/investors">Investors</Link>
                        <Link href="/terms">Terms</Link>
                    </div>
                    <p>© 2026 OWNED · IT</p>
                </div>
            </footer>

            <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
            <ExitIntentPopup />
            <ScrollTriggerPopup />
        </div>
    );
}
