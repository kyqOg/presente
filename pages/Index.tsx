import { useState } from 'react';
import Navigation from '../components/Navigation';
import MusicPlayer from '../components/MusicPlayer';
import EmberParticles from '../components/EmberParticles';
import VoceSection from '../components/sections/VoceSection';
import AgenteSection from '../components/sections/AgenteSection';
import MomentosSection from '../components/sections/MomentosSection';

const Index = () => {
  const [activeTab, setActiveTab] = useState('voce');

  const renderContent = () => {
    switch (activeTab) {
      case 'voce':
        return <VoceSection />;
      case 'agente':
        return <AgenteSection />;
      case 'momentos':
        return <MomentosSection />;
      default:
        return <VoceSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <EmberParticles />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="relative z-10">
        {renderContent()}
      </main>
      <MusicPlayer />
    </div>
  );
};

export default Index;
