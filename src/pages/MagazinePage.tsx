import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
// @ts-ignore - react-pageflip may lack types
import HTMLFlipBook from 'react-pageflip';

interface MagazinePageProps {
  onBack: () => void;
}

const TOTAL_PAGES = 100;
const SUPABASE_BASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://supabase.solucionesamano.cloud';

// NOTA: Las imágenes ahora usan el formato 0.jpg a 99.jpg
const IMAGE_EXTENSION = '.jpg'; 
const BUCKET_PATH = '/storage/v1/object/public/digital-assets-statics-documents/magazine/';

interface PageProps {
  pageNumber: number;
  isActive: boolean;
}

const MagazinePageItem = React.forwardRef<HTMLDivElement, PageProps>(
  ({ pageNumber, isActive }, ref) => {
    const imageUrl = `${SUPABASE_BASE_URL}${BUCKET_PATH}${pageNumber}${IMAGE_EXTENSION}`;

    return (
      <div ref={ref} className="bg-white shadow-md flex flex-col items-center justify-center overflow-hidden h-full w-full">
        {isActive ? (
          <img 
            src={imageUrl} 
            alt={`Página ${pageNumber}`} 
            loading="lazy"
            className="w-full h-full object-fill pointer-events-none"
            onError={(e) => {
              // Si falla la carga de la imagen, muestra una hoja en blanco sutil para no romper el diseño
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmOGZhZmMiIC8+PC9zdmc+'; 
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full bg-ink-50 text-ink-300 absolute inset-0">
            {/* Hoja en blanco de precarga */}
          </div>
        )}
      </div>
    );
  }
);
MagazinePageItem.displayName = 'MagazinePageItem';

const MagazinePage: React.FC<MagazinePageProps> = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const onPage = (e: { data: number }) => {
    setCurrentPage(e.data);
  };

  // Generamos páginas del 0 al 99
  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i);

  return (
    <div className="min-h-screen bg-ink-900 pt-24 pb-12 flex flex-col">
      <div className="container mx-auto px-4 lg:px-8 flex-1 flex flex-col">
        
        {/* Header con botón de volver */}
        <div className="flex items-center mb-6 shrink-0">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-ink-300 hover:text-brand-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al inicio</span>
          </button>
          
          <div className="ml-auto text-ink-400 text-sm font-medium">
            Página {currentPage} de {TOTAL_PAGES - 1}
          </div>
        </div>

        {/* Contenedor del Visor de la Revista */}
        <div className="flex-1 w-full rounded-2xl overflow-hidden bg-ink-950/50 border border-ink-800/50 shadow-2xl flex items-center justify-center py-8">
          {/* @ts-expect-error react-pageflip types are incomplete */}
          <HTMLFlipBook
            width={500}
            height={707} // Proporción A4 para encajar perfecto
            size="stretch"
            minWidth={300}
            maxWidth={600}
            minHeight={400}
            maxHeight={800}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onPage}
            className="magazine-flipbook"
            style={{ margin: '0 auto' }}
          >
            {pages.map((pageNum, index) => {
              // Lazy loading: Mantenemos el DOM limpio pero precargamos en un lote alrededor de la página actual
              const isActive = Math.abs(currentPage - index) <= 5; // 5 atrás y 5 adelante = Lote de ~10 imágenes
              return (
                <MagazinePageItem
                  key={pageNum}
                  pageNumber={pageNum}
                  isActive={isActive}
                />
              );
            })}
          </HTMLFlipBook>
        </div>
      </div>
    </div>
  );
};

export default MagazinePage;
