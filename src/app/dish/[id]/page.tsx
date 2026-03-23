export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Script from 'next/script'

// Need to dynamically import this component if we use the model-viewer
// However, model-viewer is a web component, so we can also just inject it using a script tag
// Or use it via standard HTML if we register the custom elements

export default async function DishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: dish, error } = await supabase
    .from('dishes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !dish) {
    return notFound()
  }

  // Get full public URL
  const { data: { publicUrl } } = supabase.storage
    .from('models')
    .getPublicUrl(dish.usdz_url)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center">{dish.name}</h1>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        {/* iOS AR Quick Look */}
        <a 
          href={publicUrl}
          rel="ar"
          className="mb-8 block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-center transition duration-300 shadow-md"
        >
          View in AR (iOS)
        </a>
        
        {/* Android / Web Fallback using model-viewer */}
        <div className="w-full h-80 relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
          <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js" strategy="lazyOnload" />
          {/* Note: model-viewer ideally needs a GLTF/GLB file for Android/Web, but it can accept a usdz attribute for iOS AR.
              We supply the usdz URL here. For full Android AR support we would need a .glb file generated. */}
          {/* @ts-expect-error: model-viewer is a web component */}
          <model-viewer
            src="" // Usually a .glb file goes here
            ios-src={publicUrl}
            alt={`A 3D model of ${dish.name}`}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm text-center p-4">
              Tap the button above to view on iOS.<br/>
              (Note: Android requires a .glb file for full 3D viewing, but iOS users can use AR Quick Look directly)
            </div>
          {/* @ts-expect-error closing tag for model-viewer */}
          </model-viewer>
        </div>
        
        <p className="mt-6 text-sm text-gray-500 text-center">
          Scanned on {new Date(dish.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
