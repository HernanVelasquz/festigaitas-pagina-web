import { ArrowLeft } from 'lucide-react';
import StrategicPlatform from '../components/sections/StrategicPlatform';
import Footer from '../components/layout/Footer';

interface StrategicPlatformPageProps {
  onBack: () => void;
  onNavigate: (path: string) => void;
}

/**
 * Dedicated page for the Festival's Strategic Platform (Mission, Vision, Values, and Objectives).
 */
export default function StrategicPlatformPage({
  onBack,
  onNavigate,
}: StrategicPlatformPageProps) {
  return (
    <div className="min-h-screen bg-ink-900 pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 section-label hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al inicio
        </button>
      </div>

      <StrategicPlatform />

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
