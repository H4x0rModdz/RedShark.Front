import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IUserPhoto } from '@/types/IUserPhoto';
import UserPhotoService from '@/services/UserPhotoService';
import PhotoModal from '@/components/ui/PhotoModal';

interface ProfilePhotosProps {
  userId?: string | string;
  isMobileView?: boolean;
}

const ProfilePhotos: React.FC<ProfilePhotosProps> = ({ userId, isMobileView = false }) => {
  const displayCount = isMobileView ? 9 : 4;

  // Temporary: direct fetch without cache
  const [photos, setPhotos] = useState<IUserPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [photosError, setPhotosError] = useState<any>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<IUserPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchPhotos = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const result = await UserPhotoService.getUserPhotos(userId);
        setPhotos(result);
      } catch (error) {
        setPhotosError(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhotos();
  }, [userId]);


  const displayedPhotos = photos?.slice(0, displayCount) || [];
  const hasMorePhotos = (photos?.length || 0) > displayCount;

  const handlePhotoClick = (photo: IUserPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  return (
    <>
    <Card className="bg-slate-800/60 border-slate-700/60 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Fotos</h3>
          {hasMorePhotos && (
            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
              Ver todas ({photos?.length || 0})
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : displayedPhotos.length > 0 ? (
          <div className={`grid ${isMobileView ? 'grid-cols-3 gap-3' : 'grid-cols-2 gap-2'}`}>
            {displayedPhotos.map((photo) => (
              <div 
                key={photo.id} 
                className="relative aspect-square bg-slate-700 rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => handlePhotoClick(photo)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.description || 'Foto do usuário'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center absolute inset-0">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {photo.description && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                    <p className="text-white text-sm font-medium">{photo.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-slate-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-400 text-sm">Nenhuma foto encontrada</p>
          </div>
        )}
      </CardContent>
    </Card>
    
    {/* Photo Modal */}
    <PhotoModal
      photo={selectedPhoto}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
    />
  </>
  );
};

export default ProfilePhotos;