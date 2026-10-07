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
    // Honeypot: real users never see or fill this. Bots that autofill every
    // field will, and the server drops those submissions.
    const [company, setCompany] = useState('');
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
                body: JSON.stringify({ name, email, source, company }),
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
                    <h2 className="text-2xl font-black tracking-tight">You&apos;re on the list</h2>
                    <p className="text-sm text-muted-foreground font-medium">
                        Thanks for your interest. We&apos;ll email you the moment onboarding opens.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot — visually hidden, off-screen, excluded from tab order and a11y tree. */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                <label htmlFor="wl-company">Company (leave this empty)</label>
                <input
                    id="wl-company"
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight md:text-3xl">{heading}</h2>
                <p className="text-base text-muted-foreground font-medium">{subheading}</p>
            </div>

            <div className="space-y-2">
                <label htmlFor="wl-name" className="text-xs font-bold text-foreground">Name</label>
                <input
                    id="wl-name"
                    type="text"
                    placeholder="Your name"
                    className="h-12 w-full rounded-xl border border-border bg-white px-4 text-base font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-[var(--brand-magenta)] focus:outline-none focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="wl-email" className="text-xs font-bold text-foreground">Email</label>
                <input
                    id="wl-email"
                    type="email"
                    placeholder="you@email.com"
                    className="h-12 w-full rounded-xl border border-border bg-white px-4 text-base font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-[var(--brand-magenta)] focus:outline-none focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={!email || isSubmitting}
                className="btn-brand inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-[0.12em] disabled:opacity-40"
            >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Join the Waitlist
            </button>

            <p className="text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                No payment required · We&apos;ll never share your email
            </p>
        </form>
    );
}
