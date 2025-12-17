import { useState, useEffect } from 'react';
import { Calendar, MapPin, Heart, Plus, X, Sparkles } from 'lucide-react';

interface Momento {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
}

interface Photo {
  id: number;
  url: string;
  caption: string;
}

const MomentosPhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    // ========== INÍCIO DA MUDANÇA ==========
    // Carrega automaticamente TODAS as imagens numeradas (1.jpeg, 2.jpeg, 3.jpeg...)
    // da pasta /src/img/momentos/ usando import.meta.glob do Vite
    const images = import.meta.glob('/src/img/momentos/*.{jpeg,jpg,png,gif}', { eager: true });
    
    const loadedPhotos: Photo[] = Object.keys(images)
      .sort((a, b) => {
        // Ordena numericamente (1.jpeg, 2.jpeg, 3.jpeg...)
        const numA = parseInt(a.match(/\/(\d+)\./)?.[1] || '0');
        const numB = parseInt(b.match(/\/(\d+)\./)?.[1] || '0');
        return numA - numB;
      })
      .map((path, index) => {
        const filename = path.split('/').pop()?.replace(/\.(jpeg|jpg|png|gif)$/, '') || `Foto ${index + 1}`;
        return {
          id: index + 1,
          url: path,
          caption: filename
        };
      });

    setPhotos(loadedPhotos);
    // ========== FIM DA MUDANÇA ==========
  }, []);

  const handleAddPhoto = () => {
    const url = prompt('Cole a URL da foto:');
    const caption = prompt('Adicione uma legenda (opcional):') || '';
    
    if (url) {
      setPhotos([...photos, { id: Date.now(), url, caption }]);
    }
  };

  const handleRemovePhoto = (id: number) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="absolute bottom-2 left-2 right-2 text-sm text-white truncate">
                {photo.caption}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemovePhoto(photo.id);
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          onClick={handleAddPhoto}
          className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors duration-300"
        >
          <Plus className="w-8 h-8" />
          <span className="text-sm">Adicionar foto</span>
        </button>
      </div>

      {photos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando fotos...</p>
        </div>
      )}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
            {selectedPhoto.caption && (
              <p className="text-center mt-4 text-lg text-white">{selectedPhoto.caption}</p>
            )}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MomentosSection = () => {
  const [momentos, setMomentos] = useState<Momento[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newMomento, setNewMomento] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
  });

  const handleAddMomento = () => {
    if (newMomento.title) {
      setMomentos([...momentos, { id: Date.now(), ...newMomento }]);
      setNewMomento({ title: '', date: '', location: '', description: '' });
      setShowForm(false);
    }
  };

  const handleRemoveMomento = (id: number) => {
    setMomentos(momentos.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-16 space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-flame-yellow animate-flicker" />
            <Calendar className="w-10 h-10 text-primary animate-float" />
            <Sparkles className="w-6 h-6 text-flame-yellow animate-flicker" />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl flame-text flame-glow">
            Momentos
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Cada momento com você é uma chama que marca nossa história. 
            Aqui guardamos as memórias mais preciosas.
          </p>
        </div>

        {/* Moments Timeline */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-display flame-text">
              Nossos momentos especiais
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="btn-flame px-4 py-2 rounded-full text-primary-foreground flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Novo momento</span>
            </button>
          </div>

          {showForm && (
            <div className="card-flame rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">Adicionar momento</h3>
                <button onClick={() => setShowForm(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Título do momento"
                value={newMomento.title}
                onChange={(e) => setNewMomento({ ...newMomento, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-foreground"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  value={newMomento.date}
                  onChange={(e) => setNewMomento({ ...newMomento, date: e.target.value })}
                  className="px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-foreground"
                />
                <input
                  type="text"
                  placeholder="Local"
                  value={newMomento.location}
                  onChange={(e) => setNewMomento({ ...newMomento, location: e.target.value })}
                  className="px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-foreground"
                />
              </div>
              <textarea
                placeholder="Descrição do momento..."
                value={newMomento.description}
                onChange={(e) => setNewMomento({ ...newMomento, description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-foreground min-h-[100px] resize-none"
              />
              <button
                onClick={handleAddMomento}
                className="btn-flame px-6 py-3 rounded-lg text-primary-foreground w-full"
              >
                Salvar momento
              </button>
            </div>
          )}

          {momentos.length > 0 ? (
            <div className="space-y-4">
              {momentos.map((momento) => (
                <div key={momento.id} className="card-flame rounded-xl p-6 group relative">
                  <button
                    onClick={() => handleRemoveMomento(momento.id)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-secondary-foreground" />
                  </button>
                  
                  <h3 className="text-xl font-display flame-text mb-3">{momento.title}</h3>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    {momento.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(momento.date).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    {momento.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {momento.location}
                      </span>
                    )}
                  </div>
                  
                  {momento.description && (
                    <p className="text-foreground/80">{momento.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card-flame rounded-xl">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Adicione seus momentos especiais aqui</p>
            </div>
          )}
        </div>

        {/* Photo Gallery */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-display flame-text text-center">
            Fotos dos momentos
          </h2>
          <MomentosPhotoGallery />
        </div>
      </div>
    </div>
  );
};

export default MomentosSection;