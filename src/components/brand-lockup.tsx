import Image from "next/image";

export function BrandLockup({
  subtitle = "AI Disease Command Center",
  size = "md",
  className = ""
}: {
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const imageSize = size === "lg" ? "h-16 w-56" : size === "sm" ? "h-9 w-28" : "h-12 w-40";
  const titleSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg";
  return (
    <div className={`flex min-w-0 items-center gap-3 ${className}`} data-testid="esn-brand-lockup">
      <div className="shrink-0 overflow-hidden rounded-md border border-border bg-[#0b1020] shadow-sm">
        <Image src="/brand/esn-labs-logo.png" alt="ESN LABS logo" width={443} height={142} className={`${imageSize} object-contain`} priority={size === "lg"} />
      </div>
      <div className="min-w-0">
        <p className={`${titleSize} truncate font-semibold leading-tight tracking-normal text-foreground`}>ESN LABS</p>
        {subtitle ? <p className="truncate text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{subtitle}</p> : null}
      </div>
    </div>
  );
}
