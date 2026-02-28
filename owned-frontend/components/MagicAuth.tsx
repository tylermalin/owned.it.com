'use client';

// This component is superseded by AuthButton.tsx
// Kept for backward compatibility with magic-demo page
import { useState } from 'react';
import { useMagic } from '@/components/MagicProvider';

export const MagicAuth = () => {
    const { user, isLoggingIn, login, logout } = useMagic();
    const [email, setEmail] = useState('');

    if (user) {
        return (
            <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-zinc-900 border-zinc-800">
                <div className="text-sm text-zinc-400">Connected as</div>
                <div className="font-mono text-lg">{user.email}</div>
                <div className="text-xs text-zinc-500 truncate max-w-[200px]">{user.publicAddress}</div>
                <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-red-400 border border-red-900/50 rounded hover:bg-red-900/20 transition-colors"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg bg-zinc-900 border-zinc-800 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-zinc-100">Connect with Email</h3>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-3 py-2 bg-zinc-950 border border-zinc-700 rounded text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                disabled={isLoggingIn}
            />
            <button
                onClick={() => email && login(email)}
                disabled={isLoggingIn}
                className="px-4 py-2 text-sm font-medium text-zinc-950 bg-zinc-100 rounded hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoggingIn ? 'Connecting...' : 'Connect'}
            </button>
        </div>
    );
};
