import React, { useState, useEffect } from 'react';
import { getVideos ,deleteVideo} from '../../../../Services/Products';
import BaseURL from '../../../../Static/Static';
import { Trash2, X, AlertCircle } from 'lucide-react';

function ViewVideos({ product, onVideoDelete }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!product || !product.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await getVideos(product.id);
        if (response && response.data) {
          setVideos(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product videos:', err);
        setError('Failed to load product videos');
        setLoading(false);
      }
    };

    fetchVideos();
  }, [product]);

  const handleDeleteVideos = async (videoId) => {
    try {
      // Assuming there's a deleteImage API function
      // await deleteImage(videoId);
       let data = {
          videoId,
          productid:product.id
        }
         let response = await deleteVideo(data)
      // For now, let's just update the UI
      setVideos(videos.filter(img => img.id !== videoId));
      
      // Notify parent component if needed
      if (onVideoDelete) {
        onVideoDelete(videoId);
       
      }

      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    }
  };

  const confirmDelete = (videoId) => {
    setDeleteConfirm(videoId);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 p-4 rounded-md flex items-start">
        <AlertCircle className="text-red-400 mr-2 flex-shrink-0" size={20} />
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="p-4 bg-gray-800 rounded-md text-center">
        <p className="text-gray-400">No videos available for this product</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-900 rounded-lg max-w-4xl mx-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Video
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              File Name
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {videos.map((image) => (
            <tr key={image.id} className="hover:bg-gray-800 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-20 w-20 flex-shrink-0">
                    <video
                      src={`${BaseURL}/${image.image}`} 
                      alt={`Product ${product.name}`}
                      className="h-20 w-20 object-cover object-center rounded-md border border-gray-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/80/80"; // Fallback image
                      }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  {videos.is_primary
                    ? <span className="text-green-400 font-semibold">Primary</span>
                    : <span className="text-gray-400">Not Primary</span>
                  }
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {deleteConfirm === videos.id ? (
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-red-400 text-sm">Confirm delete?</span>
                    <button
                      onClick={() => handleDeleteVideos(videos.id)}
                      className="text-red-400 hover:text-red-300 bg-red-900 bg-opacity-50 hover:bg-opacity-70 p-1 rounded-md"
                    >
                      Yes
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="text-gray-400 hover:text-gray-300 bg-gray-800 hover:bg-gray-700 p-1 rounded-md"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => confirmDelete(videos.id)}
                    className="text-red-400 hover:text-red-300 p-1 hover:bg-red-900 hover:bg-opacity-30 rounded-md flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={18} />
                    <span className="ml-1">Delete</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewVideos;

