import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoIosCamera } from "react-icons/io";
import { auth, db } from '../../firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { updateDoc } from "firebase/firestore";
import axios from 'axios';
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";
import { BeatLoader } from 'react-spinners';



export default function Manageprofile() {
  const [selectImage, setSelectImage] = useState(null);
  const [notEditable, setNotEditable] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profileImage: ''
  });


  //get profile data from firebase
  useEffect(() => {
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          setSelectImage(data.profileImage);
        }
      }
    };

    fetchProfileData();
  }, []);
  //upload image
  const uploadImageToImgbb = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
      const response = await axios.post('https://api.imgbb.com/1/upload?key=da1538fed0bcb5a7c0c1273fc4209307', formData);
      const url = response.data.data.url;
      setSelectImage(url);
      return url;
    } catch (error) {
      toast.error("Image upload failed");
      return null;
    }
  };
  // upload image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const uploadedImageUrl = await uploadImageToImgbb(file);
      if (uploadedImageUrl) {
        setSelectImage(uploadedImageUrl);
        setProfileData(prev => ({ ...prev, profileImage: uploadedImageUrl }));
        toast.success('Image uploaded successfully!');
      }
      setLoading(false);
    }
  };

  //update profile
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          fullName: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          profileImage: selectImage || profileData.profileImage,
        });
        toast.success('Profile updated successfully', { autoClose: 3000 });
        setNotEditable(true);
      }
    } catch (error) {
      toast.error("Failed to update profile. Error: " + error.message, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <nav aria-label="breadcrumb" className='mb-6'>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className='font-bold text-xl text-gray-800 mb-1'>Profile</h1>
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link to="/doctor-dashboard" className='text-[#D9A741] hover:underline'>Dashboard</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700 font-medium">Profile</li>
            </ol>
          </div>
        </div>
      </nav>
      
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Profile Image Section */}
        <div className='bg-white rounded-xl shadow-sm border p-6'>
          <div className="relative flex items-center justify-center">
            <img 
              className='w-full h-80 object-cover rounded-xl' 
              src={selectImage || profileData.profileImage || 'https://via.placeholder.com/300x300?text=No+Image'} 
              alt="profile image" 
            />
            <button
              onClick={() => document.getElementById("inputfile").click()}
              className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <IoIosCamera size={24} className="text-[#D9A741]" />
            </button>
          </div>
          <input type="file" className="hidden" id="inputfile" onChange={handleImageChange} accept="image/*" />
        </div>
        
        {/* Profile Form Section */}
        <div className='lg:col-span-2 bg-white rounded-xl shadow-sm border p-6'>
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Profile Information</h3>
          <form className='space-y-4'>
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9A741] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" 
                id="profile-name" 
                disabled={notEditable} 
                value={profileData.fullName} 
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} 
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9A741] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" 
                id="profile-email" 
                disabled={notEditable} 
                value={profileData.email} 
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} 
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input 
                type="tel" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9A741] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" 
                id="phone" 
                disabled={notEditable} 
                value={profileData.phone} 
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} 
              />
            </div>
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9A741] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" 
                id="current-password" 
                disabled={notEditable} 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9A741] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" 
                id="new-password" 
                disabled={notEditable} 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9A741] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" 
                id="confirm-password" 
                disabled={notEditable} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>
            
            {/* Action Buttons */}
            <div className="pt-4">
              {!notEditable ? (
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors" 
                    onClick={() => setNotEditable(!notEditable)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="flex-1 btn-primary-petut disabled:opacity-50" 
                    onClick={handleUpdate} 
                    disabled={loading}
                  >
                    {loading ? <BeatLoader color='#fff' size={8} /> : "Update"}
                  </button>
                </div>
              ) : (
                <button 
                  type="button" 
                  className="w-full btn-primary-petut" 
                  onClick={() => setNotEditable(!notEditable)}
                >
                  Update Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
