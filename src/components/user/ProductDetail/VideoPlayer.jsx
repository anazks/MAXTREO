import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';
import BaseURL from '../../../Static/Static';

const VideoPlayer = ({ videos, onClose, isOpen }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const modalRef = useRef(null);

  // Handle video playback
  useEffect(() => {
    if (isOpen && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, isOpen]);

  // Reset play state when changing videos
  useEffect(() => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [currentVideoIndex]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Pause video when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);

  if (!isOpen || !videos || videos.length === 0) return null;

  const currentVideo = videos[currentVideoIndex];
  const videoUrl = currentVideo.video || currentVideo.image;

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  const handleThumbnailClick = (index) => {
    setCurrentVideoIndex(index);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center animate-fade px-4 z-50">
      <div className="relative w-11/12 max-w-4xl bg-gray-900 rounded-xl overflow-hidden" ref={modalRef}>
        {/* Close button */}
        <button 
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-black bg-opacity-60 rounded-full flex items-center justify-center text-white hover:bg-opacity-80 transition-all duration-300"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Main video player */}
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            src={BaseURL + videoUrl}
            className="w-full h-full object-contain bg-black"
            onEnded={handleVideoEnd}
            onClick={handleVideoClick}
          />
          
          {/* Play/Pause overlay */}
          {!isPlaying && (
            <button
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-30 transition-opacity duration-300"
              onClick={handleVideoClick}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm text-white transform transition-transform duration-300 hover:scale-110">
                <Play size={32} fill="white" />
              </div>
            </button>
          )}
          
          {/* Video controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent px-4 py-3 flex items-center">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white bg-opacity-10 text-white mr-3"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            
            <div className="text-white text-sm">
              {currentVideoIndex + 1} of {videos.length}
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        {videos.length > 1 && (
          <div className="bg-gray-800 p-3 overflow-x-auto">
            <div className="flex space-x-2">
              {videos.map((video, index) => (
                <div 
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 cursor-pointer ${
                    index === currentVideoIndex ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <video 
                    src={BaseURL + (video.video || video.image)}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade {
          animation: fade 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;