'use client';

export function SavingsButton() {
    return (
        <button
            onClick={() => {
                const el = document.getElementById('savings-calculator');
                el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-brand inline-flex rounded-xl px-6 h-12 items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] w-full sm:w-auto text-center"
        >
            Calculate Your Savings →
        </button>
    );
}
