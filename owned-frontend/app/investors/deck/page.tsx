'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X, ArrowRight, Layers, ShieldCheck, Zap, User, Target, Rocket, Calendar, Wallet } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "OWNEDit",
        subtitle: "Sovereign Commerce Infrastructure",
        content: "Empowering creators with self-custodial tools that return control of code, content, and customers.",
        founder: "Tyler Malin, Founder",
        ask: "$500k Pre-Seed",
        icon: <Layers className="w-12 h-12 text-primary" />,
        bg: "bg-slate-950"
    },
    {
        id: 2,
        title: "Platform Risk is Existential",
        subtitle: "The Problem",
        content: "Creators today rent access to their own business. Payment custody risks, algorithm dependence, and data lock-in threaten $300B in annual value.",
        points: ["Centralized Custody (30-50% fees)", "Arbitrary Deplatforming", "Hidden Algorithms"],
        icon: <ShieldCheck className="w-12 h-12 text-red-500" />,
        bg: "bg-slate-900"
    },
    {
        id: 3,
        title: "Self-Custodial Infrastructure",
        subtitle: "The Solution",
        content: "OWNEDit is a protocol, not a platform. We provide smart contract factories that allow creators to deploy their own sovereign stores.",
        points: ["Creator-Owned Smart Contracts", "Direct USDC Settlement", "NFT-Based Access Control"],
        icon: <Zap className="w-12 h-12 text-amber-400" />,
        bg: "bg-slate-950"
    },
    {
        id: 4,
        title: "Live Product on Base",
        subtitle: "Traction & Tech",
        content: "V1 is fully functional on Base Sepolia. Creators are already deploying stores and accepting payments with 0% platform fees.",
        points: ["Base Native Stack", "IPFS Metadata Storage", "Farcaster MiniApp Ready"],
        icon: <Rocket className="w-12 h-12 text-primary" />,
        bg: "bg-slate-900"
    },
    {
        id: 5,
        title: "Founder: Tyler Malin",
        subtitle: "Credibility & Experience",
        content: "20-year track record in the creator economy. Previous exits, regulatory expertise, and a deep understanding of creator pain points.",
        points: ["2x Successful Founder", "SEC/Regulatory Expert", "Creator Economy OG"],
        icon: <User className="w-12 h-12 text-emerald-500" />,
        bg: "bg-slate-950"
    },
    {
        id: 6,
        title: "Why Now?",
        subtitle: "Market Convergences",
        content: "The convergence of Base's scalability, USDC's normalization, and mainstream platform fatigue creates a massive window for sovereign tools.",
        points: ["Base L2 Product-Market Fit", "Stablecoin Mainstream Adoption", "Creator Deplatforming Backlash"],
        icon: <Calendar className="w-12 h-12 text-blue-400" />,
        bg: "bg-slate-900"
    },
    {
        id: 7,
        title: "Market Opportunity",
        subtitle: "$300B TAM",
        content: "Targeting the crypto-native beachhead of 10k pro creators before scaling to the 50M global creator market.",
        points: ["5% Infrastructure Fee Opportunity", "Unit Economics: High LTV / Low CAC", "Defensible Network Effects"],
        icon: <Target className="w-12 h-12 text-rose-500" />,
        bg: "bg-slate-950"
    },
    {
        id: 8,
        title: "ETH Denver GTM",
        subtitle: "Launch Strategy",
        content: "A high-impact activation at ETH Denver to onboard alpha creators and establish OWNEDit as the infrastructure standard.",
        points: ["Alpha Creator Onboarding", "Developer Ecosystem Grants", "Post-Launch Distribution Loops"],
        icon: <Zap className="w-12 h-12 text-primary" />,
        bg: "bg-slate-900"
    },
    {
        id: 9,
        title: "Roadmap & Milestones",
        subtitle: "Q1 2026 - 2027",
        content: "From Base Mainnet launch to cross-chain expansion and a fully decentralized protocol governance model.",
        points: ["Q1: Base Mainnet Launch", "Q3: Social Graph Integration", "2027: Decentralized Registry"],
        icon: <Layers className="w-12 h-12 text-indigo-400" />,
        bg: "bg-slate-950"
    },
    {
        id: 10,
        title: "The Ask: $500k",
        subtitle: "Pre-Seed Allocation",
        content: "Building the next 18 months of runway to secure the core protocol and onboard our first 1,000 active sovereign stores.",
        points: ["Core Engineering Team", "ETH Denver Activation", "Creator Grant Fund"],
        icon: <Wallet className="w-12 h-12 text-emerald-400" />,
        bg: "bg-slate-900"
    }
];

export default function PitchDeck() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const slide = slides[currentSlide];

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide]);

    return (
        <div className={`min-h-screen ${slide.bg} text-white transition-colors duration-700 flex flex-col font-sans selection:bg-primary/30`}>
            {/* Minimal Header */}
            <header className="p-8 flex justify-between items-center relative z-20">
                <Link href="/investors" className="flex items-center gap-4 hover:opacity-70 transition-opacity">
                    <img src="/assets/logo.png" alt="OWNED" className="w-12 h-12 object-contain" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Investor Pitch</span>
                </Link>
                <Link href="/investors" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10">
                    <X className="w-5 h-5 text-slate-400" />
                </Link>
            </header>

            {/* Slide Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
                {/* Visual Flair */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,97,255,0.05)_0%,transparent_70%)] pointer-events-none" />

                <div className="max-w-4xl w-full space-y-12 relative z-10">
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-white/5 rounded-3xl border border-white/10 shadow-2xl">
                                {slide.icon}
                            </div>
                            <div className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/20">
                                {slide.subtitle}
                            </div>
                        </div>

                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-balance">
                            {slide.title.split(' ').map((word, i) => (
                                <span key={i} className={i % 2 !== 0 ? "text-primary italic font-serif" : ""}> {word} </span>
                            ))}
                        </h2>

                        <p className="text-xl md:text-3xl text-slate-400 font-medium italic leading-relaxed text-balance">
                            {slide.content}
                        </p>

                        {slide.points && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
                                {slide.points.map((point, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <span className="text-sm font-bold uppercase tracking-widest text-slate-300">{point}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {slide.founder && (
                            <div className="flex flex-col md:flex-row gap-8 md:items-center pt-8">
                                <div className="space-y-1">
                                    <p className="text-2xl font-black italic">{slide.founder}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">20yr Creator Economy Vet</p>
                                </div>
                                <div className="h-10 w-px bg-white/10 hidden md:block" />
                                <div className="space-y-1">
                                    <p className="text-2xl font-black text-primary">{slide.ask}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ask for Funding</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Slide Navigation */}
            <footer className="p-8 md:p-12 flex items-center justify-between border-t border-white/5 relative z-20">
                <div className="flex items-center gap-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                        {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                    </div>
                    <div className="flex gap-1">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 bg-primary shadow-saas' : 'w-2 bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className="p-4 bg-white/5 disabled:opacity-20 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-90"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={currentSlide === slides.length - 1}
                        className="px-8 py-4 bg-primary text-white disabled:opacity-20 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-saas"
                    >
                        {currentSlide === slides.length - 1 ? 'End Presentation' : 'Next Slide'}
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
