'use client';

import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-saas border border-border space-y-12">
                    <header className="space-y-4 text-center">
                        <Link href="/" className="inline-block mb-8">
                            <img src="/assets/logo.png" alt="OWNED" className="w-[120px] h-[120px] object-contain mx-auto" />
                        </Link>
                        <h1 className="text-5xl font-black tracking-tighter">Privacy Policy</h1>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">Last Updated: February 10, 2026</p>
                    </header>

                    <div className="prose prose-slate max-w-none space-y-8 text-neutral-800">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black italic">1. Data Collection</h2>
                            <p className="leading-relaxed font-medium">
                                OWNED IT is designed with a "privacy-first" approach. We do not use traditional tracking cookies. We collect minimal information required for checkout, such as your Name and Email as provided at the point of purchase, to facilitate digital delivery.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black italic">2. Blockchain Data</h2>
                            <p className="leading-relaxed font-medium">
                                All transaction data (wallet addresses, timestamps, and payment amounts) is processed on the public Base L2 blockchain. This data is permanent, immutable, and visible to anyone.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black italic">3. Use of Information</h2>
                            <p className="leading-relaxed font-medium">
                                Your information is used solely to provide access to purchased digital assets and to maintain your dashboard account. We do not sell your personal data to third-party advertisers.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black italic">4. Security</h2>
                            <p className="leading-relaxed font-medium">
                                We utilize industry-standard encryption for data in transit. However, the security of your digital assets ultimately depends on the security of your cryptographic wallet.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black italic">5. Updates</h2>
                            <p className="leading-relaxed font-medium">
                                We may update this policy periodically to reflect changes in our practices or regulatory requirements. Continued use of the platform constitutes acceptance of the updated policy.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black italic">6. Contact</h2>
                            <p className="leading-relaxed font-medium">
                                For inquiries regarding your privacy, please connect with us on X: <a href="https://x.com/owneditxyz" className="text-primary hover:underline">@owneditxyz</a>.
                            </p>
                        </section>
                    </div>

                    <div className="pt-12 border-t border-border text-center">
                        <Link href="/" className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
