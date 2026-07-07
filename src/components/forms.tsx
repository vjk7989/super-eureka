"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const personSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Use a valid email"),
  role: z.string().min(1),
  farm: z.string().min(1, "Assign a farm")
});

export function PersonForm() {
  const form = useForm<z.infer<typeof personSchema>>({ resolver: zodResolver(personSchema), defaultValues: { role: "field_inspector", farm: "farm-1" } });
  return (
    <form className="max-w-2xl space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm" onSubmit={form.handleSubmit(() => alert("Prototype saved. Supabase invite wiring comes later."))}>
      <Field label="Full name" error={form.formState.errors.fullName?.message}><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...form.register("fullName")} /></Field>
      <Field label="Email" error={form.formState.errors.email?.message}><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...form.register("email")} /></Field>
      <Field label="Role"><select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...form.register("role")}><option value="field_inspector">Field Inspector</option><option value="farm_manager">Farm Manager</option><option value="viewer">Viewer</option><option value="ai_dev">AI / Dev</option></select></Field>
      <Field label="Assigned farm" error={form.formState.errors.farm?.message}><select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...form.register("farm")}><option value="farm-1">Farm 01</option><option value="farm-2">Farm 02</option></select></Field>
      <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save prototype person</button>
    </form>
  );
}

export function PrototypeForm({ title, fields }: { title: string; fields: string[] }) {
  return (
    <form className="max-w-2xl space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      {fields.map((field) => <Field key={field} label={field}><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder={field} /></Field>)}
      <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save prototype record</button>
    </form>
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return <label className="block text-sm font-medium"><span className="mb-1 block text-foreground">{label}</span>{children}{error ? <span className="mt-1 block text-xs font-medium text-red-600">{error}</span> : null}</label>;
}
