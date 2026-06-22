import Hero from '../components/sections/Hero';
import Heartbeat from '../components/sections/Heartbeat';
import Timeline from '../components/sections/Timeline';
import Moments from '../components/sections/Moments';
import Winners from '../components/sections/Winners';
import Footer from '../components/layout/Footer';
import { Reveal } from '../components/ui/Reveal';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <>
      <Hero />
      <Reveal>
        <Heartbeat />
      </Reveal>
      <Reveal>
        <Timeline />
      </Reveal>
      <Reveal>
        <Moments />
      </Reveal>
      <Reveal>
        <Winners onNavigate={onNavigate} />
      </Reveal>
      <Footer onNavigate={onNavigate} />
    </>
  );
}
