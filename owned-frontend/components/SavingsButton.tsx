'use client';

export function SavingsButton() {
    return (
        <button
            onClick={() => {
                const el = document.getElementById('savings-calculator');
                el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-saas hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-center"
        >
            Calculate Your Savings →
        </button>
    );
}
