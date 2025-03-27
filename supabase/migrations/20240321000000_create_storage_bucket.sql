-- Create a new storage bucket for hotel logos
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true);

-- Allow public access to the logos bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'logos' );

-- Allow authenticated users to upload logos
create policy "Authenticated users can upload logos"
  on storage.objects for insert
  with check (
    bucket_id = 'logos'
    and auth.role() = 'authenticated'
  );

-- Allow users to update their own logos
create policy "Users can update their own logos"
  on storage.objects for update
  using (
    bucket_id = 'logos'
    and auth.uid() = owner
  );

-- Allow users to delete their own logos
create policy "Users can delete their own logos"
  on storage.objects for delete
  using (
    bucket_id = 'logos'
    and auth.uid() = owner
  ); 