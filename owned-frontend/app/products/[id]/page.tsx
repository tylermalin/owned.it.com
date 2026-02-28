'use client';

import { useParams } from 'next/navigation';
import { DEMO_METADATA } from '@/lib/demo';
import { SHOWCASE_DATA } from '@/lib/showcase';
import { getTestimonials, getAverageRating } from '@/lib/testimonials';
import { Nav } from '@/components/Nav';
import Link from 'next/link';
import {
    Star,
    CheckCircle2,
    ArrowRight,
    ChevronLeft,
    ShieldCheck,
    Users,
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
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black">Product Not Found</h1>
                    <Link href="/" className="text-primary font-bold hover:underline">Return to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20">
            <Nav />

            {/* Hero Section */}
            <header className="pt-48 pb-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />

                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group">
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
                                <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                    {avgRating} ({testimonials.length} reviews)
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-balance">
                                {product.name}
                            </h1>
                            <p className="text-xl text-muted-foreground font-medium italic leading-relaxed max-w-xl">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <Link
                                href={`/products/${productId}/checkout`}
                                className="w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-glow hover:scale-[1.05] transition-all text-center"
                            >
                                {product.callToAction || 'BUY NOW'} — ${product.price}
                            </Link>
                            {product.testimonialDiscountPercent && (
                                <div className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 flex items-center gap-2">
                                    <Zap className="w-3 h-3 fill-current" />
                                    Save {product.testimonialDiscountPercent}% with Testimonial
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-[100px] group-hover:bg-primary/30 transition-all rounded-full" />
                        <img
                            src={product.image}
                            alt={product.name}
                            className="relative w-full aspect-square object-cover rounded-[4rem] shadow-saas-lg border border-border group-hover:scale-[1.02] transition-transform duration-700"
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-32 space-y-48">
                {/* Showcase Deep Dive */}
                {showcase && (
                    <div className="space-y-32">
                        {/* The Example */}
                        <section className="space-y-12 bg-white p-12 md:p-24 rounded-[4rem] border border-border shadow-saas">
                            <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                                <ShieldCheck className="w-4 h-4" /> The Case Study
                            </div>
                            <div className="space-y-8">
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight italic">
                                    {showcase.sections.theExample.title}
                                </h2>
                                <p className="text-2xl text-foreground font-medium italic leading-relaxed text-balance">
                                    {showcase.sections.theExample.content}
                                </p>
                            </div>
                        </section>

                        {/* Implementation Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                            <section className="space-y-12">
                                <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                                    <Hammer className="w-4 h-4" /> The Infrastructure
                                </div>
                                <h2 className="text-4xl font-black tracking-tight italic">How It's Built</h2>
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

                            <section className="bg-slate-900 rounded-[3rem] p-12 text-white space-y-8 border border-white/10">
                                <div className="text-[10px] font-black uppercase tracking-widest text-primary italic">Roadmap to Success</div>
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                                            <Rocket className="w-3 h-3" /> The Launch
                                        </div>
                                        <ul className="space-y-2 text-sm text-slate-400 font-medium italic">
                                            {showcase.sections.theLaunch.strategy.slice(0, 2).map((s, i) => (
                                                <li key={i}>• {s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4 pt-8 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                                            <TrendingUp className="w-3 h-3" /> Growth
                                        </div>
                                        <ul className="space-y-2 text-sm text-slate-400 font-medium italic">
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
                <section className="space-y-24">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                                <MessageSquare className="w-4 h-4" /> Community Sentiment
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight italic leading-tight">
                                What Builders Say
                            </h2>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-border shadow-sm flex items-center gap-8">
                            <div className="text-center">
                                <div className="text-5xl font-black italic">{avgRating}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Average</div>
                            </div>
                            <div className="w-px h-12 bg-border" />
                            <div className="text-center">
                                <div className="text-5xl font-black italic text-primary">{testimonials.length}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reviews</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-border shadow-saas space-y-8 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-amber-500">
                                            {[...Array(5)].map((_, starI) => (
                                                <Star key={starI} className={`w-3 h-3 ${starI < t.rating ? 'fill-current' : 'opacity-20'}`} />
                                            ))}
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.date}</div>
                                    </div>
                                    <p className="text-xl font-medium italic leading-relaxed text-foreground">
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
                                        <div className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 bg-indigo-50 text-indigo-500 rounded-full border border-indigo-100 flex items-center gap-1.5">
                                            <Zap className="w-2.5 h-2.5 fill-current" /> Incentivized Review
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center pt-12">
                        <p className="text-sm text-muted-foreground font-medium italic mb-8">
                            Bought this? Help the community by sharing your experience.
                        </p>
                        <Link
                            href="/dashboard/library"
                            className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary hover:underline"
                        >
                            Submit a Testimonial <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
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
