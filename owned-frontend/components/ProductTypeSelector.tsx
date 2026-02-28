'use client';

export type ProductType = 'digital' | 'coaching' | 'custom' | 'course' | 'membership' | 'webinar' | 'community' | 'url' | 'merch';

interface ProductTypeSelectorProps {
    onSelect: (type: ProductType) => void;
}

const productTypes: { type: ProductType; label: string; icon: string; description: string }[] = [
    {
        type: 'digital',
        label: 'Digital Product',
        icon: '📁',
        description: 'Sell eBooks, templates, guides, or any downloadable file.',
    },
    {
        type: 'coaching',
        label: 'Coaching Call',
        icon: '🤙',
        description: 'Sell 1:1 video calls with availability scheduling built in.',
    },
    {
        type: 'course',
        label: 'eCourse',
        icon: '🎓',
        description: 'Build a structured course with modules, lessons, videos, and slides.',
    },
    {
        type: 'membership',
        label: 'Membership',
        icon: '👑',
        description: 'Sell recurring access to your premium content.',
    },
    {
        type: 'community',
        label: 'Community',
        icon: '🤝',
        description: 'NFT-gated Discord or private group access — token in their wallet.',
    },
    {
        type: 'webinar',
        label: 'Webinar',
        icon: '🎥',
        description: 'Live or recorded training events with scheduling.',
    },
    {
        type: 'merch',
        label: 'Merch / POD',
        icon: '👕',
        description: 'Sell print-on-demand apparel with sizes, colors, and mockups.',
    },
    {
        type: 'url',
        label: 'Link / URL',
        icon: '🔗',
        description: 'Direct buyers to any private link or resource after purchase.',
    },
    {
        type: 'custom',
        label: 'Custom',
        icon: '✨',
        description: 'Anything else you want to sell directly to your audience.',
    },
];


export function ProductTypeSelector({ onSelect }: ProductTypeSelectorProps) {
    return (
        <div className="space-y-12 py-10">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h2 className="text-4xl font-extrabold tracking-tight">What are you launching?</h2>
                <p className="text-lg text-muted-foreground font-medium">
                    Choose a product type to get started with a pre-built template.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {productTypes.map((item) => (
                    <button
                        key={item.type}
                        onClick={() => onSelect(item.type)}
                        className="group bg-white border border-border p-8 rounded-4xl text-left hover:shadow-saas hover:border-primary/40 transition-all flex flex-col items-start space-y-6"
                    >
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-primary/5 transition-all">
                            {item.icon}
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                                {item.label}
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                        <div className="mt-auto pt-2">
                            <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest flex items-center gap-2">
                                Select Template
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="pt-10 border-t border-border flex justify-center">
                <div className="bg-muted/50 px-6 py-3 rounded-full flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Fully secured by Base Network
                    </span>
                </div>
            </div>
        </div>
    );
}
