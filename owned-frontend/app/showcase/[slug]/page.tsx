'use client';

import { useParams } from 'next/navigation';
import { SHOWCASE_DATA } from '@/lib/showcase';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
    GraduationCap,
    FileText,
    Users2,
    Clock3,
    Music,
    MapPin,
    Play,
    Link2,
    ArrowRight,
    CheckCircle2,
    Rocket,
    TrendingUp,
    Hammer,
    ChevronLeft,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { Nav } from '@/components/Nav';

const ICON_MAP: Record<string, any> = {
    GraduationCap,
    FileText,
    Users2,
    Clock3,
    Music,
    MapPin,
    Play,
    Link2
};

export default function ShowcaseDetailPage() {
    const { slug } = useParams();
    const data = SHOWCASE_DATA[slug as string];

    if (!data) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl font-black">Case Study Not Found</h1>
                    <Link href="/" className="inline-block px-8 py-4 bg-primary text-white rounded-2xl font-bold">Return Home</Link>
                </div>
            </div>
        );
    }

    const Icon = ICON_MAP[data.icon] || Sparkles;

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20">
            <Nav />

            {/* Hero Section */}
            <header className="pt-48 pb-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

                <div className="max-w-5xl mx-auto px-6 space-y-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Protocol
                    </Link>

                    <div className="space-y-6">
                        <div className={`w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center`}>
                            <Icon className="w-10 h-10" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-balance">
                            {data.badAssExample}
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground font-medium italic max-w-2xl leading-relaxed">
                            {data.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-8">
                        {data.sections.theExample.metrics.map((metric, i) => (
                            <div key={i} className="px-6 py-3 bg-white border border-border rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                {metric}
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-32 space-y-32">
                {/* The Example */}
                <section className="space-y-12 bg-white p-12 md:p-24 rounded-[4rem] border border-border shadow-saas">
                    <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                        <Star className="w-4 h-4 fill-current" /> The Case Study
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight italic underline decoration-primary/20 underline-offset-8">
                            {data.sections.theExample.title}
                        </h2>
                        <p className="text-2xl text-foreground font-medium italic leading-relaxed text-balance">
                            {data.sections.theExample.content}
                        </p>
                    </div>
                </section>

                {/* The Build */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
                    <div className="space-y-12">
                        <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                            <Hammer className="w-4 h-4" /> The Protocol Build
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight italic leading-tight">
                            {data.sections.theBuild.title}
                        </h2>
                        <div className="space-y-6">
                            {data.sections.theBuild.steps.map((step, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex-shrink-0 flex items-center justify-center font-black text-xs">
                                        {i + 1}
                                    </div>
                                    <div className="text-lg font-bold text-slate-700 leading-tight pt-1">
                                        {step}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-[3rem] p-12 text-white space-y-8 border border-white/10 shadow-glow">
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary italic">Tech Stack Details</div>
                        <div className="space-y-4">
                            {data.sections.theBuild.tech.map((tech, i) => (
                                <div key={i} className="flex items-center gap-4 py-4 border-b border-white/10 last:border-0">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    <span className="font-bold tracking-tight text-slate-200">{tech}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* The Launch */}
                <section className="bg-primary/5 rounded-[4rem] p-12 md:p-24 border border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />

                    <div className="space-y-12 relative">
                        <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                            <Rocket className="w-4 h-4" /> The Go-To-Market
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight italic leading-[1.1]">
                                {data.sections.theLaunch.title}
                            </h2>
                            <div className="space-y-6">
                                {data.sections.theLaunch.strategy.map((item, i) => (
                                    <div key={i} className="p-6 bg-white rounded-2xl border border-border shadow-sm font-bold text-slate-700 italic">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Growth Plan */}
                <section className="space-y-16">
                    <div className="text-center space-y-6">
                        <div className="flex items-center justify-center gap-4 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                            <TrendingUp className="w-4 h-4" /> The Scaling Roadmap
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight italic leading-tight">
                            {data.sections.theGrowthPlan.title}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.sections.theGrowthPlan.goals.map((goal, i) => (
                            <div key={i} className="flex flex-col justify-between h-full bg-slate-50 p-12 rounded-[3rem] border border-border group hover:bg-slate-900 hover:text-white transition-all duration-500">
                                <div className="text-5xl font-black opacity-10 mb-8 group-hover:opacity-20">0{i + 1}</div>
                                <p className="text-xl font-black leading-tight italic">{goal}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="text-center pt-24 border-t border-border space-y-12">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight italic leading-tight">
                        Ready to Build Your <span className="text-primary italic font-serif">Bad Ass</span> Business?
                    </h2>
                    <Link
                        href="/deploy"
                        className="group relative inline-flex items-center gap-4 px-12 py-6 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-sm overflow-hidden shadow-glow hover:scale-[1.05] active:scale-[0.95] transition-all"
                    >
                        DEPLOY YOUR STORE NOW
                        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </section>
            </main>

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
        </div>
    );
}

function Star(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}
