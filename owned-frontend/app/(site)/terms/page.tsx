import { PageHeader } from '@/components/site/PageHeader';

export default function TermsPage() {
    return (
        <>
            <PageHeader eyebrow="Legal" title="Terms of Use" lede="Last Updated: February 10, 2026" />
            <div className="mx-auto max-w-3xl space-y-10 px-6 pb-16 md:pb-20">
                <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">1. Introduction</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        Welcome to OWNED IT ("we," "our," or "us"). By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions. Our platform facilitates the sale of digital assets and services directly from creators to consumers using onchain technologies.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">2. Digital Assets & Ownership</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        All purchases on OWNED IT are final and recorded on the Base L2 network. When you purchase a product, you receive a blockchain-verified Proof NFT or digital access right as described in the product metadata. Ownership is verified via your connected cryptographic wallet.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">3. Payments & Fees</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        Payments are processed in USDC on the Base network. You are responsible for ensuring sufficient balance and gas fees for transactions. OWNED IT charges a fixed 3% platform fee on each sale.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">4. Prohibited Content</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        Creators are prohibited from selling illegal, infringing, or malicious content. We reserve the right to deactivate products or marketplace access for accounts that violate these guidelines or the spirit of the sovereign creator economy.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">5. Limitation of Liability</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        OWNED IT is a decentralized-enabled commerce layer. We are not responsible for the loss of access to your cryptographic keys, network downtime, or the content of third-party digital assets sold through the platform.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">6. Contact</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        For inquiries regarding these terms, please contact us via our official X profile: <a href="https://x.com/owneditxyz" className="link-draw pb-0.5 font-bold text-primary hover:text-foreground">@owneditxyz</a>.
                    </p>
                </section>
            </div>
        </>
    );
}
