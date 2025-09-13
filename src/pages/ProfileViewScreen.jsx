import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams, useNavigate } from 'react-router-dom';
import SimpleChatService from '../services/SimpleChatService';
import UserAvatar from '../components/UserAvatar';

const ProfileViewScreen = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [profileData, setProfileData] = useState(null);
  const [userPets, setUserPets] = useState([]);
  const [privacySettings, setPrivacySettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileData(userData);
          
          // Set privacy settings with defaults
          setPrivacySettings(userData.privacy || {
            showPhone: true,
            showEmail: true,
            showLocation: true,
            showPets: true,
            allowMessages: true,
          });
          
          // Load user pets with error handling
          try {
            const petsSnapshot = await getDocs(collection(db, 'users', userId, 'pets'));
            const pets = petsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setUserPets(pets);
          } catch (petsError) {
            console.log('Could not load pets:', petsError);
            setUserPets([]);
          }
          
        } else {
          setProfileData(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

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
    } catch (error) {
      alert('Error starting chat');
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-secondary-light dark:bg-secondary-dark">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_app"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-secondary-light dark:bg-secondary-dark">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => navigate(-1)} className="text-primary_app hover:text-opacity-70">
            ← Back
          </button>
        </div>
        <div className="text-center py-8 text-gray-900 dark:text-white">
          <div className="max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">This user profile could not be loaded or does not exist.</p>
            <button 
              onClick={() => navigate('/community')}
              className="bg-primary_app text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
            >
              Back to Community
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  console.log('Rendering profile data:', profileData);

  return (
    <div className="max-w-2xl mx-auto bg-secondary-light dark:bg-secondary-dark min-h-screen">
      {/* Back Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => navigate(-1)} className="text-primary_app hover:text-opacity-70">
          ← Back
        </button>
      </div>

      {/* Profile Info */}
      <div className="p-6 text-center">
        <UserAvatar 
          imageData={profileData.profileImage} 
          userName={profileData.fullName}
          size="w-24 h-24"
        />
        
        <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">
          {profileData.fullName || profileData.name || profileData.displayName || 'Unknown User'}
        </h2>
        
        <div className="space-y-3 mb-6">
          {profileData.email && privacySettings.showEmail !== false && (
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <span>{profileData.email}</span>
            </div>
          )}

          {profileData.phone && privacySettings.showPhone !== false && (
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{profileData.phone}</span>
            </div>
          )}

          {profileData.address && privacySettings.showLocation !== false && (
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{profileData.address}</span>
            </div>
          )}

          {profileData.role && (
            <div className="flex items-center justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                profileData.role === 'Veterinarian' ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200' :
                profileData.role === 'Pet Owner' ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' :
                'bg-gray-100 dark:bg-[#313340] text-gray-800 dark:text-gray-200'
              }`}>
                {profileData.role}
              </span>
            </div>
          )}
        </div>

        {/* Chat Button */}
        {user && user.uid !== userId && privacySettings.allowMessages !== false && (
          <button
            onClick={startChat}
            className="bg-primary_app text-white px-6 py-3 rounded-lg hover:bg-opacity-90 flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Send Message
          </button>
        )}

        {/* Pets Section */}
        {privacySettings.showPets !== false && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Pets ({userPets.length})</h3>
            {userPets.length > 0 ? (
              <div className="grid gap-4">
                {userPets.map(pet => (
                  <div key={pet.id} className="bg-gray-50 dark:bg-[#313340] rounded-lg p-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary_app bg-opacity-10 rounded-lg flex items-center justify-center">
                      {pet.picture ? (
                        <img
                          src={`data:image/jpeg;base64,${pet.picture}`}
                          alt={pet.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <svg className="w-8 h-8 text-primary_app" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{pet.name || 'Unknown'}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {pet.type || 'Unknown'} • {pet.gender || 'Unknown'}
                      </p>
                      {(pet.age || pet.weight) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {pet.age && `${pet.age} years`}
                          {pet.age && pet.weight && ' • '}
                          {pet.weight && `${pet.weight} kg`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p>No pets registered</p>
              </div>
            )}
          </div>
        )}

        {user?.uid === userId && (
          <button
            onClick={() => navigate('/profile')}
            className="bg-gray-500 dark:bg-[#313340] text-white px-6 py-3 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600 flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileViewScreen;