'use client';

import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-saas border border-border space-y-12">
                    <header className="space-y-4 text-center">
                        <Link href="/" className="inline-block mb-8">
                            <img src="/assets/logo.png" alt="OWNED" className="w-[120px] h-[120px] object-contain mx-auto" />
                        </Link>
                        <h1 className="text-5xl font-black tracking-tighter">Terms of Use</h1>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">Last Updated: February 10, 2026</p>
                    </header>

                    <div className="prose prose-slate max-w-none space-y-8 text-neutral-800">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black italic">1. Introduction</h2>
                            <p className="leading-relaxed font-medium">
                                Welcome to OWNED IT ("we," "our," or "us"). By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions. Our platform facilitates the sale of digital assets and services directly from creators to consumers using onchain technologies.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black italic">2. Digital Assets & Ownership</h2>
                            <p className="leading-relaxed font-medium">
                                All purchases on OWNED IT are final and recorded on the Base L2 network. When you purchase a product, you receive a blockchain-verified Proof NFT or digital access right as described in the product metadata. Ownership is verified via your connected cryptographic wallet.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black italic">3. Payments & Fees</h2>
                            <p className="leading-relaxed font-medium">
                                Payments are processed in USDC on the Base network. You are responsible for ensuring sufficient balance and gas fees for transactions. OWNED IT charges a 3% platform fee on transactions, which may be capped for certain subscription tiers.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black italic">4. Prohibited Content</h2>
                            <p className="leading-relaxed font-medium">
                                Creators are prohibited from selling illegal, infringing, or malicious content. We reserve the right to deactivate products or marketplace access for accounts that violate these guidelines or the spirit of the sovereign creator economy.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black italic">5. Limitation of Liability</h2>
                            <p className="leading-relaxed font-medium">
                                OWNED IT is a decentralized-enabled commerce layer. We are not responsible for the loss of access to your cryptographic keys, network downtime, or the content of third-party digital assets sold through the platform.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black italic">6. Contact</h2>
                            <p className="leading-relaxed font-medium">
                                For inquiries regarding these terms, please contact us via our official X profile: <a href="https://x.com/owneditxyz" className="text-primary hover:underline">@owneditxyz</a>.
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
