import { supabase } from './supabase'

// This function isn't being called yet, so it's safe to exist
export const uploadPhoto = async (file) => {
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase
    .storage
    .from('activity-photos')
    .upload(fileName, file)
    
  if (error) throw error
  
  // Get the public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('activity-photos')
    .getPublicUrl(fileName)
    
  return publicUrl
}