// Single source of truth for site navigation. Header, footer and mobile tab bar all read from here.

export type NavLink = { label: string; href: string };

export const PRIMARY_NAV: NavLink[] = [
    { label: 'Marketplace', href: '/products' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Docs', href: '/docs' },
    { label: 'Referrals', href: '/affiliate' },
];

export const FOOTER_NAV: { title: string; links: NavLink[] }[] = [
    {
        title: 'Product',
        links: [
            { label: 'Marketplace', href: '/products' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'How it works', href: '/docs' },
            { label: 'Join the waitlist', href: '/register' },
        ],
    },
    {
        title: 'Creators',
        links: [
            { label: 'Start a store', href: '/dashboard/deploy' },
            { label: 'Referrals', href: '/affiliate' },
            { label: 'Your library', href: '/dashboard/library' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'Contact', href: '/contact' },
            { label: 'Terms', href: '/terms' },
            { label: 'Privacy', href: '/privacy' },
        ],
    },
];

export const CONTRACT_URL = 'https://sepolia.basescan.org/address/0x2CfE077af112B9F6e6Ed39e327D3d31c840401BD';
export const X_URL = 'https://x.com/owneditxyz';

/** True when `pathname` is `href` or sits under it. Home only matches exactly. */
export function isActive(pathname: string | null, href: string) {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
}
