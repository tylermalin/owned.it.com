'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DEMO_METADATA } from '@/lib/demo';
import { Nav } from '@/components/Nav';
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
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black">Product Not Found</h1>
                    <Link href="/dashboard/library" className="text-primary font-bold hover:underline">Back to Library</Link>
                </div>
            </div>
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
        <div className="min-h-screen bg-slate-50 selection:bg-primary/20">
            <Nav />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-2xl mx-auto space-y-12">
                    <Link href="/dashboard/library" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Library
                    </Link>

                    <div className="bg-white rounded-[3.5rem] border border-border shadow-saas overflow-hidden">
                        {isSuccess ? (
                            <div className="p-20 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
                                    <ShieldCheck className="w-12 h-12 text-emerald-500" />
                                </div>
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-black italic">Feedback Received.</h1>
                                    <p className="text-lg text-muted-foreground font-medium italic px-6">
                                        Your testimonial help build a stronger, more transparent sovereign economy. Thank you for your contribution.
                                    </p>
                                </div>
                                <button
                                    onClick={() => window.location.href = '/dashboard/library'}
                                    className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-glow"
                                >
                                    Return to Library
                                </button>
                            </div>
                        ) : (
                            <div className="p-12 md:p-16 space-y-12">
                                <div className="space-y-6 text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-primary/20">
                                        <MessageSquare className="w-3 h-3" /> Community Feedback
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight italic">
                                        How was your experience with {product.name}?
                                    </h1>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-10">
                                    {/* Rating */}
                                    <div className="space-y-4 text-center">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Overall Rating</label>
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
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Your Testimonial</label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="What did you love? What could be improved? Your honest feedback helps others build better..."
                                            className="w-full min-h-[200px] p-8 bg-slate-50 border border-border rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary font-medium italic text-lg transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col items-center gap-8">
                                        <div className="flex items-center gap-3 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                                            <Zap className="w-4 h-4 fill-current" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">
                                                Transparent Review Protocol
                                            </p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full max-w-sm px-12 py-6 bg-primary text-white font-black uppercase tracking-[0.3em] rounded-3xl text-sm hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-glow"
                                        >
                                            {isSubmitting ? 'SUBMITTING...' : 'SHARE TESTIMONIAL'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="text-center opacity-40">
                        <img src="/assets/logo.png" alt="OWNED" className="h-[60px] w-auto mx-auto grayscale" />
                    </div>
                </div>
            </main>
        </div>
    );
}
