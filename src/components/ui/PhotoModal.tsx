import React, { useEffect } from 'react';
import { IUserPhoto } from '@/types/IUserPhoto';

interface PhotoModalProps {
  photo: IUserPhoto | null;
  isOpen: boolean;
  onClose: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, isOpen, onClose }) => {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !photo) return null;

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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative z-10 flex items-center justify-center min-h-full p-4">
        {/* Modal Content */}
        <div 
          className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

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