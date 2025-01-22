import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("[Media Upload] Starting upload process");
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      throw new Error('No file uploaded')
    }

    // Vérification de la taille du fichier (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File size must be less than 2MB')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Génération d'un nom de fichier unique
    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`

    console.log("[Media Upload] Uploading file:", fileName);

    const { data, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error("[Media Upload] Upload error:", uploadError);
      throw uploadError
    }

    // Récupération de l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName)

    console.log("[Media Upload] Upload successful, public URL:", publicUrl);

    return new Response(
      JSON.stringify({ url: publicUrl }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    )

  } catch (error) {
    console.error("[Media Upload] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred",
        details: error.toString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    )
  }
})