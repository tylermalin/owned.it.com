'use client';

import { useState } from 'react';
import { MessageSquare, ShieldCheck, Globe, Zap, Loader2, Check } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        org: '',
        message: ''
    });
    // Honeypot — hidden from real users; bots that fill it are dropped server-side.
    const [company, setCompany] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email) {
            toast.error('Please enter your email.');
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source: 'contact',
                    name: formData.name,
                    email: formData.email,
                    org: formData.org,
                    message: formData.message,
                    company,
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Could not send your inquiry.');
            }
            setIsDone(true);
            toast.success("Thanks — we've got your inquiry and we'll be in touch.");
        } catch (err: any) {
            toast.error(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <PageHeader
                eyebrow="Enterprise Inquiry"
                title="Protocol Infrastructure,"
                accent="Custom Built."
                lede="Deploy dedicated IPFS infrastructure, custom fee routing, and white-labeled frontends for your organization."
            />

            <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-10 px-6 pb-16 md:pb-20 lg:grid-cols-2 lg:gap-16">
                {/* Visual/Text Side */}
                <div className="flex flex-col justify-between space-y-10 rounded-3xl border border-border bg-slate-50 p-6 md:p-10">
                    <div className="space-y-10">
                        <div className="flex items-start gap-5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
                                <Globe className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Dedicated Infrastructure</h3>
                                <p className="font-medium text-muted-foreground">Global IPFS pinning and custom node isolation for your digital assets.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Organization Controls</h3>
                                <p className="font-medium text-muted-foreground">Multi-sig integration, role-based access, and advanced analytics exports.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Custom Fee Models</h3>
                                <p className="font-medium text-muted-foreground">White-labeled pricing, custom on-chain fee splits, and native token support.</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border pt-8">
                        <p className="text-sm font-bold text-slate-500">&quot;Sovereign infrastructure for the world&apos;s largest content orgs.&quot;</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="rounded-3xl border border-border bg-white p-6 md:p-8">
                    {isDone ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-6 py-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                                <Check className="h-8 w-8 text-emerald-600" strokeWidth={3} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black tracking-tight">Inquiry received</h2>
                                <p className="max-w-sm font-medium text-muted-foreground">
                                    Thanks for reaching out. We&apos;ll follow up at the email you provided.
                                </p>
                            </div>
                        </div>
                    ) : (
                    <div className="space-y-8">
                    <h2 className="text-3xl font-black tracking-tight">Tell us about your project</h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Honeypot — off-screen, excluded from tab order and a11y tree. */}
                        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                            <label htmlFor="ct-company">Company (leave this empty)</label>
                            <input id="ct-company" type="text" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="ct-name" className="text-xs font-bold text-foreground">Full Name</label>
                                <input
                                    id="ct-name"
                                    type="text"
                                    placeholder="James Smith"
                                    className="h-12 w-full rounded-xl border border-border bg-white px-4 text-base font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-[var(--brand-magenta)] focus:outline-none focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="ct-email" className="text-xs font-bold text-foreground">Work Email</label>
                                <input
                                    id="ct-email"
                                    type="email"
                                    placeholder="james@org.com"
                                    className="h-12 w-full rounded-xl border border-border bg-white px-4 text-base font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-[var(--brand-magenta)] focus:outline-none focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="ct-org" className="text-xs font-bold text-foreground">Organization / Brand</label>
                            <input
                                id="ct-org"
                                type="text"
                                placeholder="e.g. Media Corp"
                                className="h-12 w-full rounded-xl border border-border bg-white px-4 text-base font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-[var(--brand-magenta)] focus:outline-none focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]"
                                value={formData.org}
                                onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="ct-message" className="text-xs font-bold text-foreground">Project Details</label>
                            <textarea
                                id="ct-message"
                                placeholder="How can OWNED help your organization scale?"
                                rows={5}
                                className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-base font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-[var(--brand-magenta)] focus:outline-none focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!formData.email || isSubmitting}
                            className="btn-brand inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-[0.12em] disabled:opacity-40"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />} Send Inquiry
                        </button>
                    </form>
                    </div>
                    )}
                </div>
            </div>
        </>
    );
}
