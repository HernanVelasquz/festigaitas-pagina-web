import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface MagazinePageProps {
  onBack: () => void;
}

const MagazinePage: React.FC<MagazinePageProps> = ({ onBack }) => {
  const magazineUrl = import.meta.env.VITE_FESTIVAL_MAGAZINE;

  return (
    <div className="min-h-screen bg-ink-900 pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8 h-[calc(100vh-8rem)]">
        
        {/* Header con botón de volver */}
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-ink-300 hover:text-brand-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al inicio</span>
          </button>
        </div>

        {/* Contenedor del Iframe de la Revista */}
        <div className="w-full h-full rounded-2xl overflow-hidden bg-ink-950/50 border border-ink-800/50 shadow-xl">
          {magazineUrl ? (
             <iframe 
                src={magazineUrl} 
                className="w-full h-full border-none"
                title="Revista del Festival de Gaitas"
                allowFullScreen
             />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-ink-400">
               <p className="text-xl font-medium mb-2">Revista no disponible</p>
               <p className="text-sm">La revista del festival se publicará pronto.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MagazinePage;
