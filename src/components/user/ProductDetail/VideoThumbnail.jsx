import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Play } from 'lucide-react';
import BaseURL from '../../../Static/Static';
import VideoPlayer from './VideoPlayer';

const VideoThumbnail = ({ videos }) => {
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  if (!videos || videos.length === 0) {
    return null;
  }

  const handleThumbnailClick = () => {
    setShowVideoPlayer(true);
  };

  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
  };

  return (
    <>
      {/* Video thumbnails */}
      {videos.map((video, index) => (
        <div 
          key={index} 
          className="w-20 h-20 overflow-hidden rounded border shadow-sm relative cursor-pointer group z-50"
          onClick={handleThumbnailClick}
        >
          <video 
            src={BaseURL + (video.video || video.image)} 
            alt={`Video thumbnail ${index + 1}`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Play size={16} className="text-white" />
          </div>
        </div>
      ))}

      {/* Video player modal using Portal */}
      {showVideoPlayer && createPortal(
        <VideoPlayer 
          videos={videos} 
          isOpen={showVideoPlayer} 
          onClose={handleCloseVideoPlayer} 
        />,
        document.body
      )}
    </>
  );
};

export default VideoThumbnail;