'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface WaitlistFormProps {
    source?: string;
    heading?: string;
    subheading?: string;
}

export function WaitlistForm({
    source = 'general',
    heading = 'Join the Waitlist',
    subheading = "Payments aren't live yet. Leave your details and we'll reach out when onboarding opens.",
}: WaitlistFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, source }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Could not record your signup.');
            }
            // Only confirm once the server has actually recorded the signup.
            setIsDone(true);
            toast.success("You're on the waitlist — we'll be in touch.");
        } catch (err: any) {
            toast.error(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isDone) {
        return (
            <div className="text-center space-y-6 py-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-emerald-600" strokeWidth={3} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black tracking-tight italic">You're on the list</h2>
                    <p className="text-sm text-muted-foreground font-medium">
                        Thanks for your interest. We'll email you the moment onboarding opens.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight italic">{heading}</h2>
                <p className="text-base text-muted-foreground font-medium">{subheading}</p>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-border text-foreground font-bold placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                <input
                    type="email"
                    placeholder="you@email.com"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-border text-foreground font-bold placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={!email || isSubmitting}
                className="w-full py-6 bg-primary text-primary-foreground rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-saas hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:scale-100 shadow-primary/20 flex items-center justify-center gap-3"
            >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                Join the Waitlist
            </button>

            <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-wider">
                No payment required · We'll never share your email
            </p>
        </form>
    );
}
