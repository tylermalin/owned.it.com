'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { ScrollTriggerPopup } from '@/components/ScrollTriggerPopup';
import { SavingsCalculator } from '@/components/SavingsCalculator';
import { SavingsButton } from '@/components/SavingsButton';
import { VideoModal } from '@/components/VideoModal';
import { HeroSection } from '@/components/HeroSection';
import { Play, ChevronRight, Star, ArrowRight, GraduationCap, FileText, Users2, Clock3, Music, MapPin, Sparkles, Link2 } from 'lucide-react';

export function LandingPageClient() {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    return (
        <>
            <HeroSection />

            {/* How it Works / 3-Step Model */}
            <section id="how-it-works" className="py-20 md:py-28 bg-white scroll-mt-28">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14 md:mb-16 space-y-4">
                        <p className="eyebrow">How it works</p>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">How <span className="text-brand-gradient">OWNED</span> works</h2>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium">Infrastructure, not just a page.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="rounded-3xl border border-border bg-white p-8 md:p-10 space-y-8 card-lift">
                            <div className="brand-sticker w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black">1</div>
                            <div className="space-y-4">
                                <h3 className="text-2xl md:text-3xl font-black tracking-tight">Build Your Store</h3>
                                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
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
                                    <span className="text-primary">•</span> Media & metadata pinned to IPFS
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-border bg-white p-8 md:p-10 space-y-8 card-lift">
                            <div className="brand-sticker w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black">2</div>
                            <div className="space-y-4">
                                <h3 className="text-2xl md:text-3xl font-black tracking-tight">Sell Anywhere</h3>
                                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                    Your store isn&apos;t locked to a single platform. Sell wherever your audience is.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                                <div className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-muted-foreground text-center">X Threads</div>
                                <div className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-muted-foreground text-center">Discord</div>
                                <div className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-muted-foreground text-center">Base Apps</div>
                                <div className="px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold text-muted-foreground text-center">Direct DMs</div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-border bg-white p-8 md:p-10 space-y-8 card-lift">
                            <div className="brand-sticker w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black">3</div>
                            <div className="space-y-4">
                                <h3 className="text-2xl md:text-3xl font-black tracking-tight">Own Everything</h3>
                                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                    You don&apos;t rent access. You own the underlying infrastructure.
                                </p>
                            </div>
                            <ul className="space-y-3 pt-4 border-t border-border/50">
                                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                                    <span className="text-primary">•</span> Contracts are truly yours (deployed to your wallet)
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                                    <span className="text-primary">•</span> Onchain settlement (USDC lands in your store contract; withdraw anytime)
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold text-foreground">
                                    <span className="text-primary">•</span> Censorship resistant (code doesn&apos;t have policies)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="relative overflow-hidden py-20 md:py-28 bg-[var(--brand-ink)] text-white rounded-[2rem] md:rounded-[2.5rem] mx-4 md:mx-6">
                <div className="brand-scanlines absolute inset-x-0 top-0 h-2" aria-hidden="true" />
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-14 md:mb-20">
                        <div className="space-y-8 text-center lg:text-left">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">
                                What makes <br /><span className="text-brand-gradient-light">OWNED</span> different?
                            </h2>
                            <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed">
                                Most creator tools give you a page. We give you infrastructure.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { h: "No account freezes", p: "Smart contracts don't have lock buttons." },
                                { h: "No payment holds", p: "USDC settles onchain into your store contract." },
                                { h: "No deplatforming", p: "Sovereign code cannot be deleted." },
                                { h: "No subscription traps", p: "Own it once, use it forever." }
                            ].map((item, i) => (
                                <div key={i} className="p-6 md:p-8 bg-white/5 rounded-3xl border border-white/10 space-y-3 transition-colors hover:border-[rgba(216,0,96,0.5)] hover:bg-white/[0.07]">
                                    <h3 className="text-xl font-black tracking-tight">{item.h}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.p}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[640px]">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Feature</th>
                                        <th className="px-6 py-5 text-center text-xs font-black uppercase tracking-widest text-slate-400">Gumroad</th>
                                        <th className="px-6 py-5 text-center text-xs font-black uppercase tracking-widest text-slate-400">Shopify</th>
                                        <th className="px-6 py-5 text-center text-xs font-black uppercase tracking-widest text-white bg-white/10">OWNED</th>
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
                                            <td className="px-6 py-5 font-bold text-slate-200">{row.feature}</td>
                                            <td className="px-6 py-5 text-center text-slate-400">{row.gumroad}</td>
                                            <td className="px-6 py-5 text-center text-slate-400">{row.shopify}</td>
                                            <td className="px-6 py-5 text-center font-black text-white bg-white/10">{row.owned}</td>
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
            <section className="py-20 md:py-28 bg-slate-50/50 relative overflow-hidden">
                <div className="absolute top-[20%] left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[20%] right-0 w-96 h-96 bg-[rgba(240,120,0,0.06)] rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 space-y-14 md:space-y-16">
                    <div className="text-center space-y-8 relative z-10">
                        <div className="brand-sticker inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-lg">
                            <Sparkles className="w-3 h-3" /> Infinite Capabilities
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.05]">
                            Build Your Store with Your <br className="hidden md:block" />
                            <span className="text-brand-gradient">Talent and Skills.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
                            From digital downloads to global events, OWNED is the infrastructure for everything you create.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                        {[
                            {
                                t: "Create a Course",
                                d: "Token-gated video series and curriculum. The buyer owns the access key forever.",
                                icon: <GraduationCap className="w-7 h-7" />,
                                color: "bg-[rgba(96,48,144,0.10)] text-[var(--brand-purple)]",
                                example: "The $50k/mo Solopreneur Course"
                            },
                            {
                                t: "Sell A Notion Template",
                                d: "Direct delivery of workspace templates. No platform approval or 30% take rates.",
                                icon: <FileText className="w-7 h-7" />,
                                color: "bg-[rgba(192,24,144,0.10)] text-[var(--brand-magenta)]",
                                example: "Infinite OS Project Management"
                            },
                            {
                                t: "Create a Community",
                                d: "NFT-gated Discord and weekly calls. Instant membership for anyone with the token.",
                                icon: <Users2 className="w-7 h-7" />,
                                color: "bg-[rgba(216,0,96,0.10)] text-[var(--brand-pink)]",
                                example: "The Sovereignty Circle"
                            },
                            {
                                t: "Sell Your Time",
                                d: "Consulting calls and bootcamp kickoffs. Automated booking and settlement.",
                                icon: <Clock3 className="w-7 h-7" />,
                                color: "bg-[rgba(240,120,0,0.12)] text-[#b45309]",
                                example: "60-Min Protocol Strategy Session"
                            },
                            {
                                t: "Sell Your Music & Art",
                                d: "Digital collections with built-in perpetual royalties. You are the record label.",
                                icon: <Music className="w-7 h-7" />,
                                color: "bg-[rgba(96,48,144,0.10)] text-[var(--brand-purple)]",
                                example: "Sovereign Sound Genesis Drop"
                            },
                            {
                                t: "Virtual or IRL Events",
                                d: "Scalable ticketing for workshops or global meetups. Verifiable on-chain.",
                                icon: <MapPin className="w-7 h-7" />,
                                color: "bg-[rgba(192,24,144,0.10)] text-[var(--brand-magenta)]",
                                example: "Founder & Team Bootcamp"
                            },
                            {
                                t: "Sell Your Games",
                                d: "Indie games delivered as IPFS downloads or browser links. Truly ownerless distribution.",
                                icon: <Play className="w-7 h-7" />,
                                color: "bg-[rgba(216,0,96,0.10)] text-[var(--brand-pink)]",
                                example: "Retro-Sovereign Arcade"
                            },
                            {
                                t: "Link Your Socials",
                                d: "Aggregate your entire digital presence. One link to rule them all.",
                                icon: <Link2 className="w-7 h-7" />,
                                color: "bg-[rgba(240,120,0,0.12)] text-[#b45309]",
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
                                    className="group rounded-3xl border border-border bg-white p-7 card-lift flex flex-col justify-between gap-8"
                                >
                                    <div className="space-y-6">
                                        <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105`}>
                                            {item.icon}
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-black tracking-tight">{item.t}</h3>
                                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.d}</p>
                                        </div>
                                    </div>
                                    <div className="pt-5 border-t border-border/60">
                                        <div className="eyebrow mb-2">Example playbook</div>
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
            <section className="py-20 md:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center space-y-12 md:space-y-14">
                    <div className="space-y-4">
                        <p className="eyebrow">Launch lineup</p>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Planned at <span className="text-brand-gradient">launch</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        {[
                            { t: "The Definitive Guide", p: "$95", d: "108 pages. The complete blueprint for sovereign commerce." },
                            { t: "Strategy Session", p: "$297", d: "60 minutes with Tyler Malin. Map your path to protocol." },
                            { t: "The Builder's Club Membership", p: "$47/mo", d: "Weekly calls. Private Discord. Priority support." }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col rounded-3xl border border-border bg-white p-8 space-y-5 card-lift">
                                <div className="w-fit rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">Planned · not yet live</div>
                                <h3 className="text-2xl font-black tracking-tight">{item.t}</h3>
                                <p className="text-4xl font-black text-primary">{item.p} <span className="text-sm font-bold text-muted-foreground">indicative</span></p>
                                <p className="flex-1 text-sm text-muted-foreground font-medium">{item.d}</p>
                                <Link href="/register" className="btn-secondary inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-xs font-black uppercase tracking-[0.12em]">Join the waitlist <ArrowRight className="h-4 w-4" /></Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer / Final CTA */}
            <section className="relative overflow-hidden py-20 md:py-28 bg-[var(--brand-ink)] text-white rounded-[2rem] md:rounded-[2.5rem] mx-4 md:mx-6 mb-16 md:mb-20">
                <div className="brand-scanlines absolute inset-x-0 top-0 h-2" aria-hidden="true" />
                <div className="absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-[rgba(192,24,144,0.25)] blur-[120px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-8 text-balance">Ready to stop renting <br className="hidden md:block" /><span className="text-brand-gradient-light">your business?</span></h2>
                    <div className="mb-14 md:mb-20 flex flex-wrap justify-center gap-3">
                        <Link href="/register" className="btn-brand inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-[0.12em]">Join the waitlist <ArrowRight className="h-4 w-4" /></Link>
                        <Link href="/pricing" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-6 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:border-white/50 hover:bg-white/5">See pricing</Link>
                    </div>
                    <div className="pt-12 md:pt-16 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-left">
                        <div className="space-y-4">
                            <h3 className="text-xl font-black tracking-tight">Still not convinced?</h3>
                            <p className="text-sm text-slate-400">Owner-only infrastructure.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f0a0d0]">Read Chapter 1</div>
                            <Link href="/products/2" className="link-draw pb-0.5 text-sm font-bold text-white">Download Free →</Link>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f0a0d0]">Watch a demo (2 min)</div>
                            <button
                                onClick={() => setIsVideoModalOpen(true)}
                                className="link-draw pb-0.5 text-sm font-bold text-white text-left"
                            >
                                See deployment in action →
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f0a0d0]">Ask questions</div>
                            <Link href="https://x.com/owneditxyz" className="link-draw pb-0.5 text-sm font-bold text-white">DM me on X →</Link>
                        </div>
                    </div>
                </div>
            </section>


            <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
            <ExitIntentPopup />
            <ScrollTriggerPopup />
        </>
    );
}
