import React from 'react'
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Edit, Plus, Save, X, Camera, Check } from 'lucide-react';

function Nouser() {
      const navigate = useNavigate();
    
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <User size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-800">No user data available</h3>
          <p className="text-gray-600 mt-2">Please log in to view your profile</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Nouser
