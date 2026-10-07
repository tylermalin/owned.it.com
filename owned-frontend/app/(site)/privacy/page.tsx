import { PageHeader } from '@/components/site/PageHeader';

export default function PrivacyPage() {
    return (
        <>
            <PageHeader eyebrow="Legal" title="Privacy Policy" lede="Last Updated: February 10, 2026" />
            <div className="mx-auto max-w-3xl space-y-10 px-6 pb-16 md:pb-20">
                <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">1. Data Collection</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        OWNED IT is designed with a "privacy-first" approach. We do not use traditional tracking cookies. We collect minimal information required for checkout, such as your Name and Email as provided at the point of purchase, to facilitate digital delivery.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">2. Blockchain Data</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        All transaction data (wallet addresses, timestamps, and payment amounts) is processed on the public Base L2 blockchain. This data is permanent, immutable, and visible to anyone.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">3. Use of Information</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        Your information is used solely to provide access to purchased digital assets and to maintain your dashboard account. We do not sell your personal data to third-party advertisers.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">4. Security</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        We utilize industry-standard encryption for data in transit. However, the security of your digital assets ultimately depends on the security of your cryptographic wallet.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">5. Updates</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        We may update this policy periodically to reflect changes in our practices or regulatory requirements. Continued use of the platform constitutes acceptance of the updated policy.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">6. Contact</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        For inquiries regarding your privacy, please connect with us on X: <a href="https://x.com/owneditxyz" className="link-draw pb-0.5 font-bold text-primary hover:text-foreground">@owneditxyz</a>.
                    </p>
                </section>
            </div>
        </>
    );
}
