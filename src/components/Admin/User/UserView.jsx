import React, { useEffect, useState, useMemo } from 'react';
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiEdit2,
  FiTrash2, FiCheckCircle, FiXCircle, FiToggleLeft, FiToggleRight
} from 'react-icons/fi';
import { getAllUsers, deleteUser, ToggleUsers } from '../../../Services/userApi';
import Loader from '../../../Loader/Loader'

import  Sidebar  from '../Sidebar';
import NeoTokyoFooter from '../footer';

function UserView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [processingUserId, setProcessingUserId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      console.log(response, "response user");
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setProcessingUserId(deleteConfirmId);
      await deleteUser(deleteConfirmId);

      // Remove user from state after successful deletion
      setUsers((prev) => prev.filter(user => user.id !== deleteConfirmId));
      showNotification('User deleted successfully');
    } catch (err) {
      console.error("Delete error:", err);
      showNotification('Failed to delete user', 'error');
    } finally {
      setDeleteConfirmId(null);
      setProcessingUserId(null);
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      setProcessingUserId(userId);
      await ToggleUsers(userId);

      // Update user's status locally
      setUsers((prev) =>
        prev.map(user =>
          user.id === userId ? { ...user, is_active: !isActive } : user
        )
      );
      showNotification(`User status updated to ${!isActive ? 'active' : 'inactive'}`);
    } catch (err) {
      console.error("Toggle status error:", err);
      showNotification('Failed to update status', 'error');
    } finally {
      setProcessingUserId(null);
    }
  };

  const getStatusBadge = useMemo(() => (isActive) =>
    isActive === true ? (
      <span className="flex items-center text-green-400">
        <FiCheckCircle className="mr-1" /> Active
      </span>
    ) : (
      <span className="flex items-center text-red-400">
        <FiXCircle className="mr-1" /> Inactive
      </span>
    ), []);

  const getRoleBadge = useMemo(() => (role) => {
    const roleClasses = {
      Admin: 'bg-purple-600 bg-opacity-20 text-purple-400',
      Editor: 'bg-blue-600 bg-opacity-20 text-blue-400',
      Customer: 'bg-gray-600 bg-opacity-20 text-gray-300'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${roleClasses[role] || 'bg-gray-600 bg-opacity-20 text-gray-300'}`}>
        {role || 'Unknown'}
      </span>
    );
  }, []);

   if (loading) {
       return <Loader/>
    }

  if (error) {
    return <div className="min-h-screen bg-gray-900 text-red-400 p-6 flex items-center justify-center">{error}</div>;
  }

  return (
    <>
    <Sidebar/>
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-rajdhani relative" style={{marginTop:"60px"}}>
      {notification.show && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 ${notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {notification.message}
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                onClick={() => setDeleteConfirmId(null)}
                disabled={processingUserId === deleteConfirmId}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                onClick={confirmDelete}
                disabled={processingUserId === deleteConfirmId}
              >
                {processingUserId === deleteConfirmId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FiUser className="mr-2" /> Registered Users
        </h1>
        <div className="bg-gray-800 px-3 py-1 rounded text-sm">Total: {users.length} users</div>
      </div>

      {users.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded text-center">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase"><FiMail className="inline mr-1" /> Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase"><FiPhone className="inline mr-1" /> Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase"><FiCalendar className="inline mr-1" /> District</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">{user.first_name || 'Unknown User'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.email ? <a href={`mailto:${user.email}`} className="text-blue-400 hover:text-blue-300">{user.email}</a> : <span className="text-gray-400">No email</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.phone_number ? <a href={`tel:${user.phone_number}`} className="hover:text-blue-400">{user.phone_number}</a> : <span className="text-gray-400">No phone</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.district || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.state || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.is_active)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-gray-700"
                        title="Edit user"
                        disabled={processingUserId === user.id}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={`p-1 rounded hover:bg-gray-700 ${user.is_active ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
                        title={`${user.is_active ? 'Deactivate' : 'Activate'} user`}
                        onClick={() => handleToggleStatus(user.id, user.is_active)}
                        disabled={processingUserId === user.id}
                      >
                        {user.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700"
                        title="Delete user"
                        onClick={() => setDeleteConfirmId(user.id)}
                        disabled={processingUserId === user.id}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
<NeoTokyoFooter/>
    </>
  );
}

export default UserView;