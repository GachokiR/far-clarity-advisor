
import { supabase } from '@/lib/supabase';

export const uploadDocument = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(fileName, file);

  if (error) throw error;
  
  // Get the public URL for the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName);
    
  return { fileName: data.path, publicUrl };
};

export const downloadDocument = async (fileName: string) => {
  const { data, error } = await supabase.storage
    .from('documents')
    .download(fileName);
    
  if (error) throw error;
  return data;
};

export const deleteDocument = async (fileName: string) => {
  const { error } = await supabase.storage
    .from('documents')
    .remove([fileName]);
    
  if (error) throw error;
};

export const getDocumentUrl = (fileName: string) => {
  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName);
    
  return data.publicUrl;
};
