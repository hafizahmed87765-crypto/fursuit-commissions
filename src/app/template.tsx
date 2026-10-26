// Remounts on every navigation, so each page fades in smoothly.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="motion-safe:animate-page">{children}</div>;
}
