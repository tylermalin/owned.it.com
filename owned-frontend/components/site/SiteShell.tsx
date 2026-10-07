import type { ReactNode } from 'react';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { MobileTabBar } from './MobileTabBar';
import { Motion } from './Motion';

/** Header, content, footer and mobile tab bar. Every public page renders inside this. */
export function SiteShell({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
            <SiteHeader />
            <main id="main" className="flex-1">
                {children}
            </main>
            <SiteFooter />
            <MobileTabBar />
            <Motion />
        </div>
    );
}
