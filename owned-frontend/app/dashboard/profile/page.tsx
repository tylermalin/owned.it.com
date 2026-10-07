'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { useUserProfile, UserProfile } from '@/lib/hooks';
import { useState, useEffect, useRef, useId } from 'react';
import { useMagic } from '@/components/MagicProvider';
import { useContractOwner } from '@/lib/useOwner';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Twitter,
    Linkedin,
    Save,
    CheckCircle2,
    Github,
    Share2,
    Wallet,
    Camera,
    Image as ImageIcon,
    ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { uploadImageToIPFS, getIPFSGatewayUrl } from '@/lib/ipfs';

export default function ProfilePage() {
    const { user } = useMagic();
    const { profile, updateProfile, isLoading } = useUserProfile();
    const { data: owner } = useContractOwner();

    const [hasDemoPro, setHasDemoPro] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHasDemoPro(localStorage.getItem('demo_pro_access') === 'true');
        }
    }, []);

    const isSeller = user?.publicAddress ? (
        ((owner as string) && user.publicAddress.toLowerCase() === (owner as string).toLowerCase()) || hasDemoPro
    ) : false;

    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);

    const bannerInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Initialize or re-sync if profile changes and user hasn't edited yet
        if (profile) {
            setFormData(prev => prev || profile);
        }
    }, [profile]);

    const handleSave = async () => {
        if (!formData) return;
        setIsSaving(true);
        try {
            updateProfile(formData);
            toast.success('Profile updated successfully!', {
                style: {
                    borderRadius: '20px',
                    background: '#333',
                    color: '#fff',
                },
            });
        } catch (e) {
            toast.error('Failed to save profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (file: File, type: 'avatar' | 'banner') => {
        if (type === 'avatar') setIsUploadingAvatar(true);
        else setIsUploadingBanner(true);

        try {
            const hash = await uploadImageToIPFS(file);

            // 1. Update form state immediately for UI
            setFormData(prev => prev ? { ...prev, [type]: hash } : null);

            // 2. AUTO-SAVE to localStorage: call updateProfile directly
            updateProfile({ [type]: hash });

            toast.success(`${type === 'avatar' ? 'Avatar' : 'Banner'} uploaded and saved!`);
        } catch (e: any) {
            console.error(`Upload error:`, e);
            toast.error(`Failed to upload ${type}: ${e.message}`);
        } finally {
            if (type === 'avatar') setIsUploadingAvatar(false);
            else setIsUploadingBanner(false);
        }
    };

    if (isLoading || !formData) {
        return (
            <DashboardLayout>
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-slate-200 rounded-xl w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="h-64 bg-slate-100 rounded-3xl" />
                        <div className="h-64 bg-slate-100 rounded-3xl" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Your Profile</h1>
                        <p className="text-sm md:text-base text-muted-foreground font-medium">
                            Manage your personal identity and delivery settings.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={`/u/${user?.publicAddress}`}
                            target="_blank"
                            className="btn-secondary rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View Public Profile
                        </a>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Account Stats / Basic Info */}
                    <div className="lg:col-span-2 overflow-hidden bg-white border border-border rounded-3xl group relative">
                        {/* Banner Area */}
                        <div className="relative h-48 md:h-64 bg-slate-100 group-hover:brightness-95 transition-all overflow-hidden">
                            {formData.banner ? (
                                <img src={getIPFSGatewayUrl(formData.banner)} alt="Banner" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                    <ImageIcon className="w-16 h-16 opacity-20" />
                                </div>
                            )}

                            {isUploadingBanner && (
                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-40">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin shadow-lg" />
                                        <p className="text-[10px] font-black text-white uppercase tracking-wider">Uploading...</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Improved Pick Button - Moved outside overflow to ensure clickability */}
                        <div
                            onClick={() => bannerInputRef.current?.click()}
                            className="absolute top-4 right-4 md:top-6 md:right-6 px-4 py-3 bg-white/90 backdrop-blur-xl rounded-xl cursor-pointer hover:bg-white active:scale-95 transition-all shadow-xl z-50 border border-white/50 group/banner"
                        >
                            <div className="flex items-center gap-3">
                                <Camera className="w-5 h-5 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Update Banner</span>
                            </div>
                            <input
                                ref={bannerInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')}
                            />
                        </div>

                        <div className="px-6 md:px-10 pb-8 md:pb-10 pt-0 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 -mt-16 relative z-10 pointer-events-none">
                            <div className="relative pointer-events-auto">
                                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary border-4 border-white shadow-xl overflow-hidden bg-white">
                                    {formData.avatar ? (
                                        <img src={getIPFSGatewayUrl(formData.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16" />
                                    )}
                                </div>
                                <div
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full border-4 border-white cursor-pointer hover:scale-110 transition-all shadow-sm"
                                >
                                    <Camera className="w-4 h-4" />
                                    <input
                                        ref={avatarInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'avatar')}
                                    />
                                </div>
                                {isUploadingAvatar && (
                                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>

                            <div className="text-center md:text-left space-y-4 flex-1 pb-4 pointer-events-auto">
                                <div className="space-y-1">
                                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">{formData.displayName || user?.email || 'Anonymous Collector'}</h2>
                                    <p className="text-sm text-muted-foreground font-medium">{user?.publicAddress?.slice(0, 6)}...{user?.publicAddress?.slice(-4)}</p>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <div className="brand-sticker rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Verified Buyer
                                    </div>
                                    {isSeller && (
                                        <div className="rounded-md px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
                                            <Save className="w-3.5 h-3.5" />
                                            Verified Seller
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Branding Section */}
                    <Section title="Store Branding" icon={<User className="w-5 h-5 text-primary" />}>
                        <div className="grid grid-cols-1 gap-6">
                            <Input
                                label="Display Name"
                                icon={<User className="w-4 h-4 text-muted-foreground" />}
                                placeholder="Tyler Malin"
                                value={formData.displayName || ''}
                                onChange={(val) => setFormData(prev => prev ? { ...prev, displayName: val } : null)}
                            />
                            <div className="space-y-3">
                                <label htmlFor="profile-bio" className="block text-xs font-bold text-foreground">
                                    Public Bio
                                </label>
                                <textarea
                                    id="profile-bio"
                                    className="w-full p-4 min-h-[120px] resize-none rounded-xl border border-border bg-white text-base font-medium placeholder:text-muted-foreground/50 focus:border-[var(--brand-magenta)] focus:outline-none focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]"
                                    placeholder="Tell the world about yourself and your products."
                                    value={formData.bio || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData(prev => prev ? { ...prev, bio: val } : null);
                                    }}
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Contact Details */}
                    <Section title="Contact Details" icon={<Mail className="w-5 h-5 text-primary" />}>
                        <div className="grid grid-cols-1 gap-6">
                            <Input
                                label="Phone Number"
                                icon={<Phone className="w-4 h-4 text-muted-foreground" />}
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone || ''}
                                onChange={(val) => setFormData({ ...formData, phone: val })}
                            />
                            <Input
                                label="Alternative Email"
                                icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                                placeholder="backup@email.com"
                                value={formData.altEmail || ''}
                                onChange={(val) => setFormData({ ...formData, altEmail: val })}
                            />
                        </div>
                    </Section>

                    {/* Social Presence */}
                    <Section title="Social Presence" icon={<Share2 className="w-5 h-5 text-primary" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Twitter / X"
                                icon={<Twitter className="w-4 h-4" />}
                                placeholder="@username"
                                value={formData.socials.twitter || ''}
                                onChange={(val) => setFormData(prev => prev ? {
                                    ...prev,
                                    socials: { ...prev.socials, twitter: val }
                                } : null)}
                            />
                            <Input
                                label="LinkedIn"
                                icon={<Linkedin className="w-4 h-4" />}
                                placeholder="linkedin.com/in/..."
                                value={formData.socials.linkedIn || ''}
                                onChange={(val) => setFormData(prev => prev ? {
                                    ...prev,
                                    socials: { ...prev.socials, linkedIn: val }
                                } : null)}
                            />
                            <Input
                                label="Website"
                                icon={<Globe className="w-4 h-4" />}
                                placeholder="yourwebsite.com"
                                value={formData.socials.website || ''}
                                onChange={(val) => setFormData(prev => prev ? {
                                    ...prev,
                                    socials: { ...prev.socials, website: val }
                                } : null)}
                            />
                            <Input
                                label="GitHub"
                                icon={<Github className="w-4 h-4" />}
                                placeholder="github.com/..."
                                value={formData.socials.github || ''}
                                onChange={(val) => setFormData(prev => prev ? {
                                    ...prev,
                                    socials: { ...prev.socials, github: val }
                                } : null)}
                            />
                        </div>
                    </Section>

                    {/* Shipping Address */}
                    <Section title="Shipping Info" icon={<MapPin className="w-5 h-5 text-primary" />}>
                        <div className="grid grid-cols-1 gap-6">
                            <Input
                                label="Street Address"
                                placeholder="123 Web3 Lane"
                                value={formData.shippingAddress.street || ''}
                                onChange={(val) => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, street: val } })}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Input
                                    label="City"
                                    placeholder="Base City"
                                    value={formData.shippingAddress.city || ''}
                                    onChange={(val) => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, city: val } })}
                                />
                                <Input
                                    label="State / Province"
                                    placeholder="CA"
                                    value={formData.shippingAddress.state || ''}
                                    onChange={(val) => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, state: val } })}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Input
                                    label="ZIP / Postal Code"
                                    placeholder="90210"
                                    value={formData.shippingAddress.zip || ''}
                                    onChange={(val) => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, zip: val } })}
                                />
                                <Input
                                    label="Country"
                                    placeholder="United States"
                                    value={formData.shippingAddress.country || ''}
                                    onChange={(val) => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, country: val } })}
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Affiliate Profile */}
                    <Section title="Affiliate Settings" icon={<User className="w-5 h-5 text-primary" />}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="profile-affiliate-bio" className="block text-xs font-bold text-foreground">
                                    Affiliate Bio
                                </label>
                                <textarea
                                    id="profile-affiliate-bio"
                                    className="w-full p-4 min-h-[160px] resize-none rounded-xl border border-border bg-white text-base font-medium placeholder:text-muted-foreground/50 focus:border-[var(--brand-magenta)] focus:outline-none focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]"
                                    placeholder="How do you plan to promote products? This helps creators know who you are."
                                    value={formData.affiliateBio || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData(prev => prev ? { ...prev, affiliateBio: val } : null);
                                    }}
                                />
                            </div>
                            <div className="p-5 bg-slate-50 rounded-xl border border-dashed border-border">
                                <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
                                    Your affiliate bio is visible to creators when you apply to be their partner or share their products.
                                </p>
                            </div>
                        </div>
                    </Section>
                </div>
            </div>
        </DashboardLayout>
    );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="rounded-3xl border border-border bg-white p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/5 rounded-xl">
                    {icon}
                </div>
                <h3 className="text-xl font-black tracking-tight">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function Input({ label, icon, placeholder, value, onChange }: { label: string; icon?: React.ReactNode; placeholder: string; value: string; onChange: (val: string) => void }) {
    const id = useId();
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-xs font-bold text-foreground">
                {label}
            </label>
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {icon}
                    </div>
                )}
                <input
                    id={id}
                    type="text"
                    placeholder={placeholder}
                    className={`h-12 w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 rounded-xl border border-border bg-white text-base font-medium placeholder:text-muted-foreground/50 focus:border-[var(--brand-magenta)] focus:outline-none focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}
