import { AppShell } from "@/components/app-shell";
import { UploadValidator } from "@/components/upload-validator";
import { getRole } from "@/lib/page-helpers";

export default function TreeDataUpload({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const role = getRole(searchParams);
  return <AppShell role={role}><UploadValidator type="tree-data" /></AppShell>;
}
