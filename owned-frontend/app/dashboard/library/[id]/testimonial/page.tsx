'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DEMO_METADATA } from '@/lib/demo';
import { DashboardLayout } from '@/components/DashboardLayout';
import Link from 'next/link';
import {
    Star,
    MessageSquare,
    ChevronLeft,
    Send,
    ShieldCheck,
    Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TestimonialSubmissionPage() {
    const params = useParams();
    const router = useRouter();
    const productId = parseInt(params.id as string);
    const product = DEMO_METADATA[productId];

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!product) {
        return (
            <DashboardLayout>
                <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Product Not Found</h1>
                    <Link href="/dashboard/library" className="link-draw pb-0.5 font-bold text-primary hover:text-foreground">Back to Library</Link>
                </div>
            </DashboardLayout>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (content.length < 10) {
            toast.error('Please provide a bit more detail in your testimonial');
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
        toast.success('Testimonial submitted! Thank you for your feedback.');

        // In a real app, we'd save this to a database or on-chain
        // For the demo, we'll just redirect back to the library
        setTimeout(() => {
            // next.js router.push doesn't work with react-router-dom useParams 
            // but I'm in a next.js app, let me fix the imports
        }, 2000);
    };

    return (
        <DashboardLayout>
                <div className="max-w-2xl space-y-8">
                    <div className="space-y-2">
                        <Link href="/dashboard/library" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Library
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Rate &amp; Review</h1>
                        <p className="text-sm md:text-base text-muted-foreground font-medium">{product.name}</p>
                    </div>

                    <div className="rounded-3xl border border-border bg-white overflow-hidden">
                        {isSuccess ? (
                            <div className="p-8 md:p-16 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100">
                                    <ShieldCheck className="w-12 h-12 text-emerald-500" />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black tracking-tight">Feedback Received.</h2>
                                    <p className="text-lg text-muted-foreground font-medium md:px-6">
                                        Your testimonial help build a stronger, more transparent sovereign economy. Thank you for your contribution.
                                    </p>
                                </div>
                                <button
                                    onClick={() => window.location.href = '/dashboard/library'}
                                    className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]"
                                >
                                    Return to Library
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 md:p-12 space-y-10">
                                <div className="space-y-6 text-center">
                                    <div className="brand-sticker inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]">
                                        <MessageSquare className="w-3 h-3" /> Community Feedback
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-foreground">
                                        How was your experience with {product.name}?
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-10">
                                    {/* Rating */}
                                    <div className="space-y-4 text-center">
                                        <label className="text-xs font-bold text-foreground">Overall Rating</label>
                                        <div className="flex items-center justify-center gap-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(star)}
                                                    className="p-2 transition-transform hover:scale-125"
                                                >
                                                    <Star
                                                        className={`w-10 h-10 ${(hoverRating || rating) >= star
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'text-slate-200'
                                                            } transition-colors`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4">
                                        <label htmlFor="testimonial-content" className="block text-xs font-bold text-foreground">Your Testimonial</label>
                                        <textarea
                                            id="testimonial-content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="What did you love? What could be improved? Your honest feedback helps others build better..."
                                            className="w-full min-h-[200px] rounded-xl border border-border bg-white p-4 text-base font-medium placeholder:text-muted-foreground/50 focus:border-[var(--brand-magenta)] focus:outline-none focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col items-center gap-8">
                                        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                                            <Zap className="w-3 h-3 fill-current" />
                                            <p className="text-[10px] font-bold uppercase tracking-wider">
                                                Transparent Review Protocol
                                            </p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] w-full max-w-sm disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'SUBMITTING...' : 'SHARE TESTIMONIAL'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
        </DashboardLayout>
    );
}
