import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getMarkerContent = async (markerId) => {
  try {
    const { data, error } = await supabase
      .from('markers')
      .select('video_url, message, title')
      .eq('id', markerId)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching marker content:', error);
    // Fallback content
    return {
      video_url: '/default-video.mp4',
      message: 'Contenido no disponible',
      title: 'Marcador Desconocido'
    };
  }
};

export const getAllMarkers = async () => {
  try {
    const { data, error } = await supabase
      .from('markers')
      .select('id, title, description')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching all markers:', error);
    return [];
  }
};
