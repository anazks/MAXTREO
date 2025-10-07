import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  User,
  MapPin,
  Edit,
  Plus,
  Save,
  X,
  Camera,
  Check,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  getMyDeliveryAddress,
  profileUpdate,
  getUserInfo,
  deleteMyAccount,
  deletAddress
} from "../../../Services/userApi";
import AddressPopup from "./AddNewAddress";
import BaseURL from "../../../Static/Static";
import Loader from "../../../Loader/Loader";
import image_on_tokyo from "../../../Images/image_on_tokyo.jpg";
function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);


const deleteAddress = async (id) => {
  try {
    if (!window.confirm("Are you sure you want to delete this address?")) {
    return;
  }
    const response = await deletAddress(id);
    if (response.status === 200 || response.status === 204) {
      // Update the UI by filtering out the deleted address
      setUserAddresses(prev => prev.filter(address => address.id !== id));
    }
  } catch (error) {
    console.error("Error deleting address:", error);
    // Optionally show an error message to the user
  }
};


  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const fetchUserData = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("authToken");

      if (!storedToken && !token) {
        navigate("/login");
        return;
      }

      const response = await getUserInfo();

      if (response?.data) {
        setUserData(response.data);
        setFormData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          phone_number: response.data.phone_number || "",
          date_of_birth: response.data.date_of_birth || "",
          district: response.data.district || "",
          state: response.data.state || "",
          address: response.data.address || "",
          pin_code: response.data.pin_code || "",
          age: response.data.age || "",
        });
        localStorage.setItem("userProfile", JSON.stringify(response.data));
      } else {
        tryLoadFromLocalStorage();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      tryLoadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  const tryLoadFromLocalStorage = () => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setFormData({
          first_name: parsedUser.first_name || "",
          last_name: parsedUser.last_name || "",
          phone_number: parsedUser.phone_number || "",
          date_of_birth: parsedUser.date_of_birth || "",
          district: parsedUser.district || "",
          state: parsedUser.state || "",
          address: parsedUser.address || "",
          pin_code: parsedUser.pin_code || "",
          age: parsedUser.age || "",
        });
      } catch (e) {
        console.error("Error parsing stored user data", e);
      }
    }
  };

  const getAddress = useCallback(async () => {
    try {
      const { data } = await getMyDeliveryAddress();
      setUserAddresses(data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setUserAddresses([]);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      tryLoadFromLocalStorage();
      await fetchUserData();
      await getAddress();
    };

    loadData();
  }, [fetchUserData, getAddress]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);


  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // const styles = {
  //   width: windowWidth >= 768 ? "100%" : "120%",
  //   marginTop: windowWidth >= 768 ? "0px" : "25px"
  // };


  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("authToken");
    setToken(null);
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      if (profilePicture) {
        formDataToSend.append("profile_picture", profilePicture);
      }

      const { data } = await profileUpdate(formDataToSend);

      if (data) {
        const updatedUserData = { ...userData, ...data };
        setUserData(updatedUserData);
        localStorage.setItem("userProfile", JSON.stringify(updatedUserData));
        setUpdateSuccess(true);
        setTimeout(() => setIsEditing(false), 2000);
      }
    } catch (error) {
      setUpdateError(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setPreviewImage(null);
    setProfilePicture(null);
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        phone_number: userData.phone_number || "",
        date_of_birth: userData.date_of_birth || "",
        district: userData.district || "",
        state: userData.state || "",
        address: userData.address || "",
        pin_code: userData.pin_code || "",
        age: userData.age || "",
      });
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteMyAccount();
      localStorage.removeItem("userProfile");
      localStorage.removeItem("authToken");
      setToken(null);
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  };


  const getProfilePicture = () => {
    if (previewImage) return previewImage;
    if (userData?.profile_picture) return userData.profile_picture;
    if (userData?.profile_picture_url) return userData.profile_picture_url;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  if (!userData) {
    navigate("/login");
    return null;
  }


  return (
    <div
      className="min-h-screen text-black"
      style={{ marginTop: "100px", fontFamily: "'Rajdhani', sans-serif" }}
    >
      {/* <div 
      className="hidden md:block fixed top-[50px] w-[30%] h-[600px]  rounded-[10px] overflow-hidden -z-10 right-[100px] bg-gray-100 bg-opacity-10 backdrop-blur-[2px]"
    >
      <img 
        src={image_on_tokyo} 
        alt="Tokyo" 
        className="h-full w-full object-cover"  
      />
    </div> */}
      {/* Header */}
      {/* <header className=" p-4 flex justify-between items-center" >
        <h1 className="text-2xl font-bold text-pink-600" style={{textAlign:"center"}}>Your Profile</h1>
       
      </header> */}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* User Info Card */}

        {/* Recent Orders */}

        {/* Main Content Area */}
        <div className="grid grid-cols-12 gap-6">
          {/* Right Panel - Content */}

          <div className="col-span-12 md:col-span-8">
            <div
              className="bg-gray-200 bg-opacity-60 backdrop-blur-sm rounded-lg p-6 mb-6 flex items-center"
              
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center mr-4">
                {getProfilePicture() ? (
                  <img
                    src={
                      getProfilePicture().startsWith("http")
                        ? getProfilePicture()
                        : BaseURL + getProfilePicture()
                    }
                    alt="Profile"
                    className="w-full h-full object-cover "
                  />
                ) : (
                  <User size={32} className="text-black-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {userData?.first_name} {userData?.last_name || ""}
                </h2>
                <div className="flex items-center text-gray-400 text-sm">
                  <span className="bg-pink-600 text-black text-xs px-2 py-0.5 rounded mr-2">
                    Member
                  </span>
                  <span>{userData?.email}</span>
                </div>

                {userData?.phone_number && (
                  <p className="text-gray-400 text-sm mt-1">
                    {userData.phone_number}
                  </p>
                )}
              </div>
            </div>
            {isEditing ? (
              <EditProfileForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                cancelEdit={cancelEdit}
                getProfilePicture={getProfilePicture}
                handleProfilePicChange={handleProfilePicChange}
                updateSuccess={updateSuccess}
                updateError={updateError}
                userData={userData}
                triggerFileInput={triggerFileInput}
                fileInputRef={fileInputRef}
              />
            ) : (
              <ViewProfile
                userData={userData}
                userAddresses={userAddresses}
                setIsEditing={setIsEditing}
                getProfilePicture={getProfilePicture}
                setShowAddressPopup={setShowAddressPopup}
                deleteAddress={deleteAddress}
              />
            )}
          </div>
          {/* Left Panel */}
          <div
            className="col-span-12 md:col-span-4  p-4 pt-10"
            style={{
              backgroundImage: `url(${image_on_tokyo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "10px",
            }}
          >
            <div
              className="bg-white bg-opacity-50 backdrop-blur-sm  rounded-lg p-4 mb-6"
              style={{ marginTop: "100px" }}
            >
              <h3 className="text-lg font-semibold mb-4">Profile Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between bg-gray-300 bg-opacity-10 backdrop-blur-sm hover:bg-gray-300 transition-colors rounded-md"
                >
                  <span className="flex items-center">
                    <Edit size={18} className="mr-3 text-pink-500" />
                    <span style={{color:'white'}}>Edit Profile</span>
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
                <button
                  onClick={() => setShowAddressPopup(true)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between bg-gray-300 bg-opacity-10 backdrop-blur-sm hover:bg-gray-300 transition-colors rounded-md"
                >
                  <span className="flex items-center">
                    <Plus size={18} className="mr-3 text-pink-500" />
                    <span style={{color:'white'}}>Add New Address</span>
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 flex items-center justify-between bg-gray-300 bg-opacity-10 backdrop-blur-sm hover:bg-gray-300 transition-colors rounded-md"
                >
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3 text-pink-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    <span>Log Out</span>
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
                <button
                  onClick={() => setIsDeleting(true)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between bg-gray-300 bg-opacity-10 backdrop-blur-sm hover:bg-gray-300 transition-colors rounded-md text-red-400"
                >
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                    <span>Delete Account</span>
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
            <div className="mb-6" style={{ borderRadius: "10px" }}>
              <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-black">
                  Recent Activity
                </h3>

                {userAddresses && userAddresses.length > 0 ? (
                  <div className="space-y-3">
                    {userAddresses.slice(0, 3).map((address, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm border-b border-gray-800 pb-2"
                      >
                        <span className="text-gray-400 mr-2">#{idx + 1}</span>
                        <span className="flex-grow">
                          {address.district || address.address}
                        </span>
                        <span className="text-gray-400">
                          {address.pin_code || address.zip_code}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddressPopup && (
        <AddressPopup
          onClose={() => setShowAddressPopup(false)}
          onSuccess={() => {
            getAddress();
            setShowAddressPopup(false);
          }}
        />
      )}

      {isDeleting && (
        <DeleteConfirmationPopup
          onClose={() => setIsDeleting(false)}
          onConfirm={handleDeleteAccount}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

const DeleteConfirmationPopup = ({ onClose, onConfirm, isDeleting }) => (
  <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
    <div className="bg-gray-100 bg-opacity-10 backdrop-blur-sm rounded-lg p-6 max-w-md w-full border border-gray-800">
      <h3 className="text-xl font-semibold text-black mb-4">
        Confirm Account Deletion
      </h3>
      <p className="text-gray-300 mb-6">
        Are you sure you want to delete your account? This action cannot be
        undone.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800"
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-black rounded-md hover:bg-red-700 flex items-center"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader className="animate-spin mr-2" size={16} />
          ) : null}
          {isDeleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  </div>
);

const EditProfileForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  cancelEdit,
  getProfilePicture,
  handleProfilePicChange,
  updateSuccess,
  updateError,
  userData,
  triggerFileInput,
  fileInputRef,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 bg-opacity-10 backdrop-blur-sm rounded-lg p-6"
      style={{ border: "1px solid black" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Edit Profile</h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={cancelEdit}
            className="flex items-center text-gray-400 hover:text-black"
          >
            <X size={18} className="mr-1" /> Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-1.5 bg-pink-600 text-black rounded-full hover:bg-pink-700"
          >
            <Save size={18} className="mr-1" /> Save Changes
          </button>
        </div>
      </div>

      {updateSuccess && (
        <div className="mb-4 p-2 bg-green-900 border border-green-700 text-green-300 rounded flex items-center">
          <Check size={16} className="mr-1" /> Profile updated successfully!
        </div>
      )}

      {updateError && (
        <div className="mb-4 p-2 bg-red-900 border border-red-700 text-red-300 rounded">
          {updateError}
        </div>
      )}

      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center mb-2 cursor-pointer"
            onClick={triggerFileInput}
          >
            {getProfilePicture() ? (
              <img
                src={
                  getProfilePicture().startsWith("http")
                    ? getProfilePicture()
                    : BaseURL + getProfilePicture()
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={40} className="text-gray-400" />
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePicChange}
            className="hidden"
            accept="image/*"
          />
          <button
            type="button"
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 bg-pink-600 text-black p-1.5 rounded-full hover:bg-pink-700 transition-colors"
          >
            <Camera size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            First Name*
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-300 bg-opacity-10 backdrop-blur-sm border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-black"
            required
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-300 bg-opacity-10 backdrop-blur-sm border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-black"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={userData.email || ""}
            disabled
            className="w-full px-3 py-2 bg-gray-300 bg-opacity-10 backdrop-blur-sm border border-gray-600 rounded-md text-gray-400"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number*
          </label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-300 bg-opacity-10 backdrop-blur-sm border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-black"
            required
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-300 bg-opacity-10 backdrop-blur-sm border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-black"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-300 bg-opacity-10 backdrop-blur-sm border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-black"
            min="1"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            PIN Code
          </label>
          <input
            type="text"
            name="pin_code"
            value={formData.pin_code || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-300 bg-opacity-10 backdrop-blur-sm border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-black"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            District
          </label>
          <input
            type="text"
            name="district"
            value={formData.district || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-300 bg-opacity-10 backdrop-blur-sm border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-black"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-300 bg-opacity-10 backdrop-blur-sm border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-black"
          />
        </div>
        <div className="form-group md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 bg-gray-300 bg-opacity-10 backdrop-blur-sm border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-black"
          ></textarea>
        </div>
      </div>
    </form>
  );
};

const ViewProfile = ({
  userData,
  userAddresses,
  setIsEditing,
  getProfilePicture,
  setShowAddressPopup,
  deleteAddress
}) => (
  <div className="space-y-6">
    <div
      className="bg-gray-100 bg-opacity-10 backdrop-blur-sm rounded-lg p-6"
      style={{ border: "1px solid black" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-black">
          Personal Information
        </h3>
        <button
          onClick={() => setIsEditing(true)}
          style={{color:'white'}}
          className="flex items-center px-4 py-1.5 bg-pink-600 text-black rounded-full hover:bg-pink-700 transition-all"
        >
          <Edit size={16} className="mr-1"  style={{color:'white'}}/> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
        <div>
          <p className="text-sm font-medium text-gray-400">First Name</p>
          <p className="text-black">{userData.first_name || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Last Name</p>
          <p className="text-black">{userData.last_name || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Email</p>
          <p className="text-black">{userData.email || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Phone Number</p>
          <p className="text-black">
            {userData.phone_number || "Not provided"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Date of Birth</p>
          <p className="text-black">
            {userData.date_of_birth || "Not provided"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Age</p>
          <p className="text-black">{userData.age || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">PIN Code</p>
          <p className="text-black">{userData.pin_code || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">District</p>
          <p className="text-black">{userData.district || "Not available"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">State</p>
          <p className="text-black">{userData.state || "Not available"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm font-medium text-gray-400">Address</p>
          <p className="text-black">
            {userData.address || "No address provided"}
          </p>
        </div>
      </div>
    </div>

    <div
      className="bg-gray-100 bg-opacity-10 backdrop-blur-sm rounded-lg p-6"
      style={{ border: "1px solid black" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Delivery Addresses</h3>
        <button
          onClick={() => setShowAddressPopup(true)}
          style={{color:'white'}}
          className="flex items-center px-4 py-1.5 bg-pink-600 text-black rounded-full hover:bg-pink-700 transition-all"
        >
          <Plus size={16} className="mr-1" /> Add New Address
        </button>
      </div>

      {userAddresses && userAddresses.length > 0 ? (
        <div className="space-y-4">
          {userAddresses.map((address, idx) => (
            <div
              key={idx}
              className="bg-gray-300 bg-opacity-10 backdrop-blur-sm rounded-lg p-4 flex items-start"
            >
              <div className="bg-gray-700 p-2 rounded-full mr-3">
                <MapPin size={20} className="text-pink-500" />
              </div>
              <div className="flex-grow">
                <p className="font-medium">
                  {address.address_name || `Address ${idx + 1}`}
                  {address.is_default && (
                    <span className="ml-2 text-xs bg-pink-600 text-black px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-400">
                  {address.address || address.street},{" "}
                  {address.district || address.city}
                </p>
                <p className="text-sm text-gray-400">
                  {address.state}, {address.pin_code || address.zip_code}
                </p>
                <p className="text-sm text-gray-400">{address.phone_number}</p>
              </div>
              <div className="flex space-x-2">
                {/* <button className="p-1.5 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                </button> */}
               <button 
                    onClick={() => deleteAddress(address.id)}
                    className="p-1.5 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg">
          <MapPin size={40} className="text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400">No delivery addresses found</p>
          <button
            onClick={() => setShowAddressPopup(true)}
            className="mt-3 px-4 py-2 bg-pink-600 text-black rounded-md hover:bg-pink-700 transition-all flex items-center mx-auto"
          >
            <Plus size={16} className="mr-1" /> Add Address
          </button>
        </div>
      )}
    </div>

  </div>
);

export default UserProfile;
