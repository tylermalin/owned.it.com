'use client';

import { useParams } from 'next/navigation';
import { SHOWCASE_DATA } from '@/lib/showcase';
import { PageHeader } from '@/components/site/PageHeader';
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
            <PageHeader
                eyebrow="Example playbook"
                title="Example not found"
                actions={
                    <Link href="/" className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]">
                        Return Home
                    </Link>
                }
            />
        );
    }

    const Icon = ICON_MAP[data.icon] || Sparkles;

    return (
        <div className="bg-background selection:bg-primary/20">
            <PageHeader
                eyebrow="Example playbook"
                title={data.badAssExample}
                lede={data.description}
            >
                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                    </div>
                    {data.sections.theExample.metrics.map((metric, i) => (
                        <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                            {metric}
                        </span>
                    ))}
                </div>
                <p className="mt-4 text-xs font-medium text-muted-foreground">
                    Hypothetical example. Figures are illustrative, not results from a real store.
                </p>
                <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground link-draw pb-0.5 hover:text-foreground">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Protocol
                </Link>
            </PageHeader>

            <div className="mx-auto max-w-5xl px-6 pb-16 md:pb-20 space-y-16 md:space-y-20">
                {/* The Example */}
                <section className="brand-card brand-card-hover rounded-[2rem] bg-white overflow-hidden">
                    <div className="brand-scanlines h-2.5" aria-hidden="true" />
                    <div className="p-6 md:p-12 space-y-6">
                        <p className="eyebrow flex items-center gap-2">
                            <Star className="w-4 h-4 fill-current" /> Example (hypothetical)
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                            {data.sections.theExample.title}
                        </h2>
                        <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed text-balance">
                            {data.sections.theExample.content}
                        </p>
                    </div>
                </section>

                {/* The Build */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
                    <div className="space-y-8">
                        <p className="eyebrow flex items-center gap-2">
                            <Hammer className="w-4 h-4" /> The Protocol Build
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                            {data.sections.theBuild.title}
                        </h2>
                        <div className="space-y-5">
                            {data.sections.theBuild.steps.map((step, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex-shrink-0 flex items-center justify-center font-black text-xs">
                                        {i + 1}
                                    </div>
                                    <div className="text-base md:text-lg font-bold text-slate-700 leading-snug pt-1">
                                        {step}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-3xl border border-border bg-white p-6 md:p-8 card-lift space-y-4">
                        <p className="eyebrow">Tech Stack Details</p>
                        <div>
                            {data.sections.theBuild.tech.map((tech, i) => (
                                <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                    <span className="font-bold tracking-tight text-foreground">{tech}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* The Launch */}
                <section className="rounded-3xl bg-primary/5 border border-primary/10 p-6 md:p-12 space-y-8">
                    <p className="eyebrow flex items-center gap-2">
                        <Rocket className="w-4 h-4" /> The Go-To-Market
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                            {data.sections.theLaunch.title}
                        </h2>
                        <div className="space-y-4">
                            {data.sections.theLaunch.strategy.map((item, i) => (
                                <div key={i} className="p-5 bg-white rounded-xl border border-border font-bold text-slate-700">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* The Growth Plan */}
                <section className="space-y-10">
                    <div className="text-center space-y-4">
                        <p className="eyebrow flex items-center justify-center gap-2">
                            <TrendingUp className="w-4 h-4" /> The Scaling Roadmap
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                            {data.sections.theGrowthPlan.title}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {data.sections.theGrowthPlan.goals.map((goal, i) => (
                            <div key={i} className="flex flex-col justify-between h-full rounded-3xl border border-border bg-white p-6 md:p-8 card-lift">
                                <div className="text-4xl font-black text-primary/20 mb-6">0{i + 1}</div>
                                <p className="text-lg font-black leading-tight text-foreground">{goal}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="text-center pt-16 border-t border-border space-y-8">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                        Ready to Build Your <span className="text-brand-gradient">Bad Ass</span> Business?
                    </h2>
                    <Link
                        href="/dashboard/deploy"
                        className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] group"
                    >
                        DEPLOY YOUR STORE NOW
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </section>
            </div>
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
