import React, { useState, useEffect } from "react";
import {
  Upload,
  Edit,
  Trash2,
  Star,
  StarOff,
  ImageIcon,
  Link,
  Save,
  X,
  Plus,
} from "lucide-react";
import Axios from "../../../Axios/Axios";
import Sidebar from "../Sidebar";
import NeoFooter from "../footer";
import Loader from "../../../Loader/Loader";

const NvidiaImageManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    name_of_image: "",
    image: null,
    link: "",
    is_featured: false,
  });
  const [editFormData, setEditFormData] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchImages();
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const fetchImages = async () => {
    try {
      const response = await Axios.get("/authentication/nvidia-images/");
      // Axios returns data directly in response.data
      setImages(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
      showMessage("Failed to fetch images", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!formData.image) {
      showMessage("Please select an image file", "error");
      return;
    }

    const data = new FormData();
    data.append("name_of_image", formData.name_of_image);
    data.append("image", formData.image);
    data.append("link", formData.link);
    data.append("is_featured", formData.is_featured);

    try {
      // For FormData, don't wrap in body object - pass FormData directly
      const response = await Axios.post(
        "/authentication/nvidia-images/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Axios automatically handles success (status 200-299)
      showMessage("Image uploaded successfully!");
      setFormData({
        name_of_image: "",
        image: null,
        link: "",
        is_featured: false,
      });
      setShowUploadForm(false);
      fetchImages();
    } catch (error) {
      console.error("Upload error:", error);
      showMessage("Upload failed", "error");
    }
  };

  const handleEdit = async (id) => {
    const data = new FormData();
    data.append("name_of_image", editFormData.name_of_image);
    if (editFormData.image) {
      data.append("image", editFormData.image);
    }
    data.append("link", editFormData.link);
    data.append("is_featured", editFormData.is_featured);

    try {
      const response = await Axios.patch(
        `/authentication/nvidia-images/${id}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showMessage("Image updated successfully!");
      setEditingId(null);
      fetchImages();
    } catch (error) {
      console.error("Update error:", error);
      showMessage("Update failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await Axios.delete(`/authentication/nvidia-images/${id}/`);
      showMessage("Image deleted successfully!");
      fetchImages();
    } catch (error) {
      console.error("Delete error:", error);
      showMessage("Delete failed", "error");
    }
  };

  const toggleFeatured = async (id, currentStatus) => {
    try {
      const endpoint = currentStatus ? "remove_featured" : "set_featured";
      await Axios.post(`/authentication/nvidia-images/${id}/${endpoint}/`);

      showMessage(
        `Image ${currentStatus ? "unfeatured" : "featured"} successfully!`
      );
      fetchImages();
    } catch (error) {
      console.error("Featured toggle error:", error);
      showMessage("Failed to update featured status", "error");
    }
  };

  const startEdit = (image) => {
    setEditingId(image.id);
    setEditFormData({
      name_of_image: image.name_of_image || "",
      link: image.link || "",
      is_featured: image.is_featured,
      image: null,
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Sidebar />

      <div
        className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8"
        style={{ fontFamily: "Rajdhani, sans-serif", marginTop:"60px" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-4 sm:mb-0">
              NVIDIA Image Manager
            </h1>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add New Image
            </button>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "error"
                  ? "bg-red-900 text-red-200"
                  : "bg-green-900 text-green-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Upload Form */}
          {showUploadForm && (
            <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-pink-600">
              <h2 className="text-2xl font-bold text-pink-600 mb-4">
                Upload New Image
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image Name
                  </label>
                  <input
                    type="text"
                    value={formData.name_of_image}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name_of_image: e.target.value,
                      })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-pink-600 focus:outline-none"
                    placeholder="Enter image name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Link</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-pink-600 focus:outline-none"
                    placeholder="Enter link URL"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Select Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:border-pink-600 focus:outline-none"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_featured: e.target.checked,
                      })
                    }
                    className="mr-2 accent-pink-600"
                  />
                  <label htmlFor="featured" className="text-sm">
                    Set as Featured
                  </label>
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="bg-pink-600 hover:bg-pink-700 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Upload size={18} />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-pink-600 transition-colors"
              >
                {/* Image Display */}
                <div className="relative h-48 bg-gray-700 flex items-center justify-center">
                  {image.image ? (
                    <img
                      src={image.image}
                      alt={image.name_of_image || "Nvidia Image"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={48} className="text-gray-500" />
                  )}
                  {image.is_featured && (
                    <div className="absolute top-2 right-2 bg-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      FEATURED
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {editingId === image.id ? (
                    // Edit Form
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editFormData.name_of_image}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            name_of_image: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-pink-600 focus:outline-none"
                        placeholder="Image name"
                      />
                      <input
                        type="url"
                        value={editFormData.link}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            link: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-pink-600 focus:outline-none"
                        placeholder="Link URL"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            image: e.target.files[0],
                          })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-pink-600 focus:outline-none"
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editFormData.is_featured}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              is_featured: e.target.checked,
                            })
                          }
                          className="mr-2 accent-pink-600"
                        />
                        <label className="text-sm">Featured</label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(image.id)}
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                        >
                          <Save size={14} />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                        >
                          <X size={14} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div>
                      <h3 className="font-semibold text-pink-600 mb-2 truncate">
                        {image.name_of_image || "Untitled"}
                      </h3>
                      {image.link && (
                        <div className="flex items-center gap-1 mb-2 text-sm text-gray-300">
                          <Link size={14} />
                          <a
                            href={image.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-600 truncate"
                          >
                            {image.link}
                          </a>
                        </div>
                      )}
                      <p className="text-sm text-gray-400 mb-4">
                        Added: {new Date(image.date_added).toLocaleDateString()}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() =>
                            toggleFeatured(image.id, image.is_featured)
                          }
                          className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
                            image.is_featured
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-gray-600 hover:bg-gray-700"
                          }`}
                        >
                          {image.is_featured ? (
                            <StarOff size={14} />
                          ) : (
                            <Star size={14} />
                          )}
                          {image.is_featured ? "Unfeature" : "Feature"}
                        </button>
                        <button
                          onClick={() => startEdit(image)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(image.id)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-xl text-gray-400">No images found</p>
              <p className="text-gray-500">
                Upload your first image to get started
              </p>
            </div>
          )}
        </div>
      </div>
      <NeoFooter />
    </>
  );
};

export default NvidiaImageManager;
