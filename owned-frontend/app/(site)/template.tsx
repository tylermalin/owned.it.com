/** Re-mounts on every navigation, so each page gets the same gentle entrance. */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
    return <div className="page-enter">{children}</div>;
}
