'use client';

import { useParams } from 'next/navigation';
import { DEMO_METADATA } from '@/lib/demo';
import { SHOWCASE_DATA } from '@/lib/showcase';
import { getTestimonials, getAverageRating } from '@/lib/testimonials';
import Link from 'next/link';
import {
    Star,
    CheckCircle2,
    ArrowRight,
    ChevronLeft,
    ShieldCheck,
    MessageSquare,
    Zap,
    Hammer,
    Rocket,
    TrendingUp
} from 'lucide-react';

export default function ProductDetailPage() {
    const { id } = useParams();
    const productId = parseInt(id as string);
    const product = DEMO_METADATA[productId];

    // Attempt to find matching showcase data by name mapping
    const showcaseMap: Record<number, string> = {
        1: 'strategy-session',
        2: 'notion-template', // Reusing template format for guide
        7: 'sovereign-circle'
    };
    const showcase = SHOWCASE_DATA[showcaseMap[productId] || ''];
    const testimonials = getTestimonials(productId);
    const avgRating = getAverageRating(productId);

    if (!product) {
        return (
            <div className="flex items-center justify-center px-6 py-24 md:py-32">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black tracking-tight">Product Not Found</h1>
                    <Link href="/" className="link-draw pb-0.5 font-bold text-primary hover:text-foreground">Return to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="selection:bg-primary/20">
            {/* Hero Section */}
            <section className="pt-12 pb-16 md:pt-16 md:pb-20 bg-slate-50 relative overflow-hidden" data-no-reveal>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[rgba(192,24,144,0.06)] rounded-full blur-[110px] -z-10" />

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-10">
                        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground hover:text-primary transition-colors group">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Marketplace
                        </Link>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(avgRating) ? 'fill-current' : 'opacity-30'}`} />
                                    ))}
                                </div>
                                <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                                    {avgRating} ({testimonials.length} reviews)
                                </span>
                            </div>
                            <h1 className="text-[2.4rem] sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-balance text-foreground">
                                {product.name}
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <Link
                                href={`/products/${productId}/checkout`}
                                className="btn-brand w-full sm:w-auto rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-center"
                            >
                                {product.callToAction || 'BUY NOW'} — ${product.price}
                            </Link>
                            {product.testimonialDiscountPercent && (
                                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 inline-flex items-center justify-center gap-2">
                                    <Zap className="w-3 h-3 fill-current" />
                                    Save {product.testimonialDiscountPercent}% with Testimonial
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="brand-card rounded-[2rem] bg-white overflow-hidden">
                        <div className="brand-scanlines h-2.5" aria-hidden="true" />
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full aspect-square object-cover"
                        />
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 space-y-20 md:space-y-28">
                {/* Showcase Deep Dive */}
                {showcase && (
                    <div className="space-y-16 md:space-y-20">
                        {/* The Example */}
                        <section className="space-y-8 rounded-3xl border border-border bg-white p-6 md:p-12">
                            <div className="eyebrow flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Example (hypothetical)
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                                    {showcase.sections.theExample.title}
                                </h2>
                                <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed text-balance">
                                    {showcase.sections.theExample.content}
                                </p>
                            </div>
                        </section>

                        {/* Implementation Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                            <section className="space-y-8">
                                <div className="eyebrow flex items-center gap-2">
                                    <Hammer className="w-4 h-4" /> The Infrastructure
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">How It's Built</h2>
                                <div className="space-y-6">
                                    {showcase.sections.theBuild.steps.map((step, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex-shrink-0 flex items-center justify-center font-black text-[10px]">
                                                {i + 1}
                                            </div>
                                            <p className="font-bold text-slate-700 leading-tight">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-slate-900 rounded-3xl p-6 md:p-10 text-white space-y-8 border border-white/10">
                                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">Roadmap to Success</div>
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                                            <Rocket className="w-3 h-3" /> The Launch
                                        </div>
                                        <ul className="space-y-2 text-sm text-slate-300 font-medium">
                                            {showcase.sections.theLaunch.strategy.slice(0, 2).map((s, i) => (
                                                <li key={i}>• {s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4 pt-8 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                                            <TrendingUp className="w-3 h-3" /> Growth
                                        </div>
                                        <ul className="space-y-2 text-sm text-slate-300 font-medium">
                                            {showcase.sections.theGrowthPlan.goals.slice(0, 2).map((g, i) => (
                                                <li key={i}>• {g}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {/* Ratings & Testimonials */}
                <section className="space-y-12 md:space-y-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-10">
                        <div className="space-y-4">
                            <div className="eyebrow flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> Community Sentiment
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                                What Builders Say
                            </h2>
                        </div>
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-border flex items-center justify-center gap-8">
                            <div className="text-center">
                                <div className="text-5xl font-black tracking-tight">{avgRating}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Average</div>
                            </div>
                            <div className="w-px h-12 bg-border" />
                            <div className="text-center">
                                <div className="text-5xl font-black tracking-tight text-primary">{testimonials.length}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reviews</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {testimonials.map((t, i) => (
                            <div key={i} className="rounded-3xl border border-border bg-white p-6 md:p-8 card-lift space-y-8 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-amber-500">
                                            {[...Array(5)].map((_, starI) => (
                                                <Star key={starI} className={`w-3 h-3 ${starI < t.rating ? 'fill-current' : 'opacity-20'}`} />
                                            ))}
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.date}</div>
                                    </div>
                                    <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground">
                                        "{t.content}"
                                    </p>
                                </div>
                                <div className="pt-8 border-t border-border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                            {t.author.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="text-xs font-black uppercase tracking-widest text-foreground">
                                            {t.author}
                                            {t.isVerified && <span className="ml-2 text-primary">✓</span>}
                                        </div>
                                    </div>
                                    {t.isIncentivized && (
                                        <div className="brand-sticker rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
                                            <Zap className="w-2.5 h-2.5 fill-current" /> Incentivized Review
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center pt-4">
                        <p className="text-sm text-muted-foreground font-medium mb-6">
                            Bought this? Help the community by sharing your experience.
                        </p>
                        <Link
                            href="/dashboard/library"
                            className="btn-secondary rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]"
                        >
                            Submit a Testimonial <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
