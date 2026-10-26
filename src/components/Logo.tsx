import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="FursuitCommissions.com home">
      <Image src="/brand/icon-src.png" alt="" width={48} height={48} priority className="h-11 w-11 transition-transform duration-300 group-hover:-rotate-6" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-bold tracking-tight text-forest">fursuit</span>
        <span className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-mint-deep">Commissions</span>
      </span>
    </Link>
  );
}
