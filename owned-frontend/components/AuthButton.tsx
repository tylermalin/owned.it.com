'use client';

import { useState } from 'react';
import { useMagic } from '@/components/MagicProvider';
import { Mail, LogOut, ChevronDown, Loader2, User, LayoutDashboard, Settings, Library, Package, Users, Wallet } from 'lucide-react';
import Link from 'next/link';

type AuthButtonProps = {
    /** primary: gradient. secondary: white sticker, for the header next to the main CTA. */
    variant?: 'primary' | 'secondary';
    /** Full width, for menus and stacked layouts. */
    block?: boolean;
};

export function AuthButton({ variant = 'primary', block = false }: AuthButtonProps = {}) {
    const { user, isLoading, isLoggingIn, login, logout, magic } = useMagic();

    const [email, setEmail] = useState('');
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    // Connected via Magic
    if (user?.publicAddress) {
        const displayAddr = `${user.publicAddress.slice(0, 6)}...${user.publicAddress.slice(-4)}`;
        return (
            <div className="relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    aria-expanded={showMenu}
                    aria-haspopup="menu"
                    className="btn-secondary flex items-center gap-3 px-3 py-2 rounded-xl group"
                >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left hidden md:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">My Wallet</p>
                        <p className="text-xs font-bold text-foreground">{user.email || displayAddr}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>

                {showMenu && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                        <div className="menu-in absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-border shadow-saas-lg z-50 overflow-hidden">
                            <div className="brand-scanlines h-1.5" aria-hidden="true" />
                            <div className="p-4 border-b border-border">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Wallet Address</p>
                                <p className="text-xs font-mono font-bold text-foreground mt-1 break-all">{user.publicAddress}</p>
                            </div>
                            {user.email && (
                                <div className="px-4 py-3 border-b border-border">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</p>
                                    <p className="text-xs font-bold text-foreground mt-1">{user.email}</p>
                                </div>
                            )}
                            <div className="px-4 py-4 border-b border-border bg-slate-50/50">
                                <button
                                    onClick={async () => {
                                        setShowMenu(false);
                                        try {
                                            const isLoggedIn = await magic?.user.isLoggedIn();
                                            if (!isLoggedIn) await magic?.wallet.connectWithUI();
                                            await magic?.wallet.showUI();
                                        } catch (e) { }
                                    }}
                                    className="btn-brand w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-[0.12em]"
                                >
                                    <Wallet className="w-4 h-4" /> Open Magic Wallet
                                </button>
                                <p className="text-[10px] text-center text-muted-foreground font-medium mt-3">
                                    View balance, send, receive, and buy USDC
                                </p>
                            </div>
                            <div className="p-2 space-y-1">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setShowMenu(false)}
                                    className="w-full px-3 py-2 flex items-center gap-3 text-sm font-bold text-foreground hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    <LayoutDashboard className="w-4 h-4 text-primary" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/library"
                                    onClick={() => setShowMenu(false)}
                                    className="w-full px-3 py-2 flex items-center gap-3 text-sm font-bold text-foreground hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    <Library className="w-4 h-4 text-primary" />
                                    Library
                                </Link>
                                <Link
                                    href={`/u/${user.publicAddress}`}
                                    onClick={() => setShowMenu(false)}
                                    className="w-full px-3 py-2 flex items-center gap-3 text-sm font-bold text-foreground hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    <User className="w-4 h-4 text-primary" />
                                    Profile
                                </Link>
                                <Link
                                    href="/dashboard/products"
                                    onClick={() => setShowMenu(false)}
                                    className="w-full px-3 py-2 flex items-center gap-3 text-sm font-bold text-foreground hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    <Package className="w-4 h-4 text-primary" />
                                    Products
                                </Link>
                                <Link
                                    href="/dashboard/affiliates"
                                    onClick={() => setShowMenu(false)}
                                    className="w-full px-3 py-2 flex items-center gap-3 text-sm font-bold text-foreground hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    <Users className="w-4 h-4 text-primary" />
                                    Affiliates
                                </Link>
                            </div>
                            <button
                                onClick={() => { logout(); setShowMenu(false); }}
                                className="w-full px-4 py-3 flex items-center gap-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="px-5 py-2.5 bg-white border border-border rounded-xl">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Email login form
    if (showEmailInput) {
        return (
            <div className="flex items-center gap-2">
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!email) return;
                        try {
                            await login(email);
                        } catch {
                            // Error handled in provider
                        }
                    }}
                    className="flex items-center gap-2"
                >
                    <input
                        type="email"
                        placeholder="you@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-4 py-3 bg-white border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-48 transition-all"
                        autoFocus
                        disabled={isLoggingIn}
                    />
                    <button
                        type="submit"
                        disabled={isLoggingIn || !email}
                        className="btn-brand px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                        {isLoggingIn ? 'Sending...' : 'Sign In'}
                    </button>
                </form>
                <button
                    onClick={() => setShowEmailInput(false)}
                    className="px-3 py-3 text-muted-foreground hover:text-foreground transition-colors text-xs font-bold"
                >
                    ✕
                </button>
            </div>
        );
    }

    // Default: show Sign In option
    return (
        <button
            onClick={() => setShowEmailInput(true)}
            className={`${variant === 'primary' ? 'btn-brand' : 'btn-secondary'} ${block ? 'flex w-full justify-center h-12' : 'inline-flex'} items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-[0.12em]`}
        >
            <Mail className="w-4 h-4" />
            <span>Sign in</span>
        </button>
    );
}
