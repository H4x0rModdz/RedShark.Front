import React, { useEffect } from 'react';
import { IUserPhoto } from '@/types/IUserPhoto';

interface PhotoModalProps {
  photo: IUserPhoto | null;
  photos?: IUserPhoto[];
  currentIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ 
  photo, 
  photos = [], 
  currentIndex = 0, 
  isOpen, 
  onClose, 
  onNavigate 
}) => {
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight' && onNavigate) {
        onNavigate('next');
      } else if (event.key === 'ArrowLeft' && onNavigate) {
        onNavigate('prev');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen || !photo) return null;

  const hasMultiplePhotos = photos.length > 1;
  const canGoToPrev = hasMultiplePhotos;
  const canGoToNext = hasMultiplePhotos;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative z-10 flex items-center justify-center min-h-full p-4">
        {/* Navigation Arrows */}
        {hasMultiplePhotos && onNavigate && (
          <>
            {/* Previous Arrow */}
            <button
              onClick={() => onNavigate('prev')}
              disabled={!canGoToPrev}
              className="absolute left-4 z-20 w-12 h-12 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Next Arrow */}
            <button
              onClick={() => onNavigate('next')}
              disabled={!canGoToNext}
              className="absolute right-4 z-20 w-12 h-12 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Modal Content */}
        <div 
          className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 max-w-5xl w-full max-h-[90vh] overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Photo Counter */}
        {hasMultiplePhotos && (
          <div className="absolute top-4 left-4 z-30 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} de {photos.length}
          </div>
        )}

        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Container */}
          <div className="lg:w-2/3 bg-black flex items-center justify-center">
            <img
              src={photo.imageUrl}
              alt={photo.description || 'Foto do usuário'}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Info Panel */}
          <div className="lg:w-1/3 p-6 space-y-4 overflow-y-auto">
            {/* Photo Title/Description */}
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                {photo.description || 'Foto sem título'}
              </h2>
              <p className="text-slate-400 text-sm">
                Adicionada em {formatDate(photo.createdAt)}
              </p>
            </div>

            {/* Photo Details */}
            <div className="space-y-3">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Detalhes</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID:</span>
                    <span className="text-white">{photo.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Data de criação:</span>
                    <span className="text-white">{formatDate(photo.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Última atualização:</span>
                    <span className="text-white">{formatDate(photo.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-300 mb-2">URL da Imagem</h3>
                <p className="text-xs text-slate-400 break-all bg-slate-900/50 rounded p-2">
                  {photo.imageUrl}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-700">
              <button
                onClick={() => window.open(photo.imageUrl, '_blank')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Abrir imagem original
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;