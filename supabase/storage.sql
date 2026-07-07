insert into storage.buckets (id, name, public)
values
  ('drone-images', 'drone-images', false),
  ('orthomosaic-images', 'orthomosaic-images', false),
  ('tree-images', 'tree-images', false),
  ('inspection-images', 'inspection-images', false),
  ('training-feedback', 'training-feedback', false),
  ('reports', 'reports', false)
on conflict (id) do nothing;

create policy "authenticated_read_scoped_storage"
on storage.objects for select
to authenticated
using (bucket_id in ('drone-images','orthomosaic-images','tree-images','inspection-images','training-feedback','reports'));

create policy "admin_ai_upload_operational_media"
on storage.objects for insert
to authenticated
with check (bucket_id in ('drone-images','orthomosaic-images','tree-images','training-feedback','reports'));

create policy "inspectors_upload_ground_photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'inspection-images');
