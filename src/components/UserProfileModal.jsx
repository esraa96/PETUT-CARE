import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import SimpleChatService from '../services/SimpleChatService';
import UserAvatar from './UserAvatar';

const UserProfileModal = ({ userId, isOpen, onClose }) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setProfileData(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async () => {
    if (!user || user.uid === userId) return;
    
    try {
      const chatId = await SimpleChatService.createOrGetChat(userId);
      navigate('/chats', { 
        state: { 
          selectedChat: {
            id: chatId,
            otherUserId: userId,
            otherUserName: profileData?.fullName || profileData?.name || profileData?.displayName || 'Unknown User',
            otherUserImage: profileData?.profileImage
          }
        }
      });
      onClose();
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const viewFullProfile = () => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#313340] rounded-lg max-w-sm w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_app mx-auto"></div>
          </div>
        ) : profileData ? (
          <div className="text-center">
            <UserAvatar 
              imageData={profileData.profileImage} 
              userName={profileData.fullName}
              size="w-20 h-20"
            />
            
            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white">
              {profileData.fullName || profileData.name || profileData.displayName || 'Unknown User'}
            </h3>
            
            {profileData.role && (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                profileData.role === 'Veterinarian' ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200' :
                profileData.role === 'Pet Owner' ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' :
                'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
                {profileData.role}
              </span>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={viewFullProfile}
                className="bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Profile
              </button>
              
              {user && user.uid !== userId && (
                <button
                  onClick={startChat}
                  className="bg-primary_app text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Profile not found</p>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default UserProfileModal;