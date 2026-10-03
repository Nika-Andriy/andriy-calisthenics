import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = 
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && 
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a progress photo either to Supabase Storage or creates a base64/blob local fallback.
 */
export async function uploadProgressPhoto(
  file: File, 
  pose: string, 
  weightKg: number,
  notes?: string
) {
  const fileName = `${Date.now()}_${pose}_${file.name.replace(/\s+/g, '_')}`;
  const filePath = `andriy/${fileName}`;

  if (isSupabaseConfigured) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('progress-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.warn("Supabase storage upload error, falling back to local object URL:", uploadError);
      return uploadLocalFallback(file, pose, weightKg, notes);
    }

    const { data: publicUrlData } = supabase.storage
      .from('progress-photos')
      .getPublicUrl(uploadData.path);

    const photoUrl = publicUrlData.publicUrl;

    // Save record to DB
    const { data: recordData, error: recordError } = await supabase
      .from('progress_photos')
      .insert({
        athlete_name: 'Андрій',
        photo_url: photoUrl,
        storage_path: uploadData.path,
        pose,
        weight_kg: weightKg,
        taken_at: new Date().toISOString().split('T')[0],
        notes
      })
      .select()
      .single();

    if (recordError) {
      console.warn("DB insert error, falling back locally:", recordError);
      return uploadLocalFallback(file, pose, weightKg, notes, photoUrl);
    }

    return recordData;
  }

  return uploadLocalFallback(file, pose, weightKg, notes);
}

function uploadLocalFallback(
  file: File, 
  pose: string, 
  weightKg: number, 
  notes?: string,
  existingUrl?: string
) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = existingUrl || (reader.result as string);
      const newPhoto = {
        id: `local-${Date.now()}`,
        athlete_name: 'Андрій',
        photo_url: url,
        storage_path: `local/${file.name}`,
        pose,
        weight_kg: weightKg,
        taken_at: new Date().toISOString().split('T')[0],
        notes: notes || '',
        created_at: new Date().toISOString()
      };

      try {
        const stored = localStorage.getItem('andriy_progress_photos');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newPhoto);
        localStorage.setItem('andriy_progress_photos', JSON.stringify(list));
      } catch (err) {
        console.error("Local storage error:", err);
      }

      resolve(newPhoto);
    };
    reader.readAsDataURL(file);
  });
}
