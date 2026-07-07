export function MetricCard({ label, value, detail, tone = "default" }: { label: string; value: string | number; detail?: string; tone?: "default" | "risk" | "healthy" | "info" }) {
  const toneClass = {
    default: "border-border",
    risk: "border-red-200 bg-red-50/70",
    healthy: "border-emerald-200 bg-emerald-50/70",
    info: "border-cyan-200 bg-cyan-50/70"
  }[tone];
  return (
    <div className={`rounded-lg border bg-card p-4 shadow-sm ${toneClass}`}>
      <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold leading-none text-card-foreground">{value}</p>
      {detail ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p> : null}
    </div>
  );
}
