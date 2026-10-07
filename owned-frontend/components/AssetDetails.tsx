'use client';

import React, { useState } from 'react';
import { ProductMetadata } from '@/lib/ipfs';
import { FormattedDescription } from './FormattedDescription';
import {
    X,
    ExternalLink,
    Download,
    ChevronRight,
    PlayCircle,
    Calendar,
    MessageSquare,
    Package,
    ShieldCheck,
    Globe
} from 'lucide-react';

interface AssetDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    asset: any;
    metadata: ProductMetadata;
}

export function AssetDetails({ isOpen, onClose, asset, metadata }: AssetDetailsProps) {
    const [expandedModule, setExpandedModule] = useState<number | null>(0);

    if (!isOpen) return null;

    const title = metadata.name || `Asset #${asset.id}`;
    const image = metadata.image ? (metadata.image.startsWith('ipfs://') ? `https://ipfs.io/ipfs/${metadata.image.replace('ipfs://', '')}` : metadata.image) : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 pointer-events-none">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md pointer-events-auto"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl border border-white/20 overflow-hidden flex flex-col pointer-events-auto animate-in zoom-in-95 duration-300">
                <div className="brand-scanlines h-2 shrink-0" aria-hidden="true" />
                {/* Header */}
                <div className="px-6 md:px-8 py-6 border-b border-border bg-slate-50 flex items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-border shadow-sm shrink-0">
                            <span className="text-xl">
                                {metadata.productType === 'course' ? '🎓' :
                                    metadata.productType === 'merch' ? '👕' :
                                        metadata.productType === 'community' ? '🔐' :
                                            metadata.productType === 'coaching' ? '🗓️' : '📦'}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight">{title}</h2>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Verified Ownership · Asset #{asset.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white hover:bg-slate-100 rounded-xl border border-border transition-all text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12">
                    {/* Hero Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="aspect-square rounded-3xl overflow-hidden border border-border shadow-saas">
                            {image ? (
                                <img src={image} alt={title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                                    <Package className="w-24 h-24" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary">About this Asset</h3>
                                <div className="max-h-64 overflow-y-auto pr-4 scrollbar-hide">
                                    <FormattedDescription text={metadata.description || ''} className="text-base" />
                                </div>
                            </div>

                            {/* Verification Badge */}
                            <div className="p-6 bg-slate-50 rounded-3xl border border-border flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Base On-Chain Identity</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Ownership Confirmed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Specific Content */}
                    <div className="pt-12 border-t border-border border-dashed space-y-8">
                        {metadata.productType === 'course' && metadata.curriculum && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-extrabold tracking-tight">Course Curriculum</h3>
                                    <span className="text-xs font-black uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full text-muted-foreground">
                                        {metadata.curriculum.modules?.length || 0} Modules
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {metadata.curriculum.modules?.map((mod: any, i: number) => (
                                        <div key={i} className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                                            <button
                                                onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-all"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                                                        {i + 1}
                                                    </div>
                                                    <span className="font-bold text-left">{mod.title}</span>
                                                </div>
                                                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedModule === i ? 'rotate-90' : ''}`} />
                                            </button>
                                            {expandedModule === i && (
                                                <div className="px-6 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
                                                    {mod.lessons?.map((lesson: any, j: number) => (
                                                        <div key={j} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-border">
                                                            <div className="flex items-center gap-3">
                                                                <PlayCircle className="w-4 h-4 text-muted-foreground" />
                                                                <span className="text-sm font-medium text-slate-600">{lesson.title}</span>
                                                            </div>
                                                            {lesson.duration && (
                                                                <span className="text-[10px] text-muted-foreground font-medium">{lesson.duration}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {metadata.productType === 'community' && (
                            <div className="p-6 md:p-10 bg-[var(--brand-ink)] rounded-3xl text-white space-y-6 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-10">
                                    <MessageSquare className="w-64 h-64" />
                                </div>
                                <div className="relative space-y-4">
                                    <h3 className="text-3xl font-black tracking-tight">Join the Inner Circle</h3>
                                    <p className="text-slate-300 max-w-md leading-relaxed font-medium">
                                        Your membership NFT has been verified. You now have full access to our private community and governance channels.
                                    </p>
                                    <div className="pt-4 flex flex-wrap gap-4">
                                        <a href={metadata.community?.discordUrl || '#'} target="_blank" className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]">
                                            <MessageSquare className="w-4 h-4" />
                                            ENTER DISCORD
                                        </a>
                                        <div className="px-6 h-12 bg-white/10 border border-white/20 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
                                            <Globe className="w-3 h-3" />
                                            PRIVATE PORTAL ACTIVE
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(metadata.productType === 'coaching' || metadata.productType === 'consulting') && (
                            <div className="p-6 md:p-8 bg-emerald-50 border border-emerald-100 rounded-3xl space-y-6 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm">
                                        <Calendar className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight text-emerald-900">Session Confirmed</h3>
                                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Meeting Details Below</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm space-y-2">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Scheduled For</p>
                                        <p className="font-bold text-lg">Next Available Session</p>
                                        <p className="text-xs text-muted-foreground font-medium">Check your email for the calendar invite.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm space-y-2">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Access Link</p>
                                        <a href={metadata.consulting?.meetingUrl || '#'} target="_blank" className="inline-flex items-center gap-2 text-primary font-bold link-draw pb-0.5 hover:text-foreground">
                                            Open Meeting Room <ExternalLink className="w-3 h-3" />
                                        </a>
                                        <p className="text-xs text-muted-foreground font-medium">Join 5 mins before start.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {metadata.productType === 'merch' && (
                            <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-border space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h3 className="text-xl font-extrabold tracking-tight">Order Details</h3>
                                    <div className="brand-sticker rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]">
                                        Ready for Fulfillment
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Partner</p>
                                        <p className="font-bold">{metadata.merch?.fulfillmentPartner || 'Standard Shipping'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Item Stats</p>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-0.5 bg-white border border-border rounded text-[10px] font-black uppercase tracking-tighter">Size: MD</span>
                                            <span className="px-2 py-0.5 bg-white border border-border rounded text-[10px] font-black uppercase tracking-tighter">Color: BLK</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Expected Delivery</p>
                                        <p className="font-bold">5-7 Business Days</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 md:px-10 py-6 md:py-8 border-t border-border bg-slate-50 flex items-center justify-between gap-4 shrink-0">
                    <button
                        onClick={onClose}
                        className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Close Portal
                    </button>
                    <div className="flex items-center gap-3">
                        {metadata.redirectUrl ? (
                            <a
                                href={metadata.redirectUrl}
                                target="_blank"
                                className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]"
                            >
                                <ExternalLink className="w-4 h-4" />
                                GO TO CONTENT
                            </a>
                        ) : metadata.digitalFileHash ? (
                            <a
                                href={`https://ipfs.io/ipfs/${metadata.digitalFileHash}`}
                                target="_blank"
                                className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]"
                            >
                                <Download className="w-4 h-4" />
                                DOWNLOAD ASSET
                            </a>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
