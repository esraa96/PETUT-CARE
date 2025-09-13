import React, { Fragment, useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase.js';
import { BeatLoader } from 'react-spinners';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FaTimes } from 'react-icons/fa';
import logo from '../../assets/petut.png';
import axios from 'axios';
export default function AddDoctorModal({ fetchDoctors }) {
    const [isOpen, setIsOpen] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [status, setStatus] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [cardFrontImage, setCardFrontImage] = useState(null);
    const [cardBackImage, setCardBackImage] = useState(null);
    const [idImage, setIdImage] = useState(null);
    const [experience, setExperience] = useState('');
    const [description, setDescription] = useState('');
    const [facebookLink, setFacebookLink] = useState('');
    const [twitterLink, setTwitterLink] = useState('');
    const [instagramLink, setInstagramLink] = useState('');
    const [linkedinLink, setLinkedinLink] = useState('');
    const [loading, setLoading] = useState(false);

    const resetFields = () => {
        setFullName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setGender('');
        setStatus('');
        setProfileImage(null);
        setCardFrontImage(null);
        setCardBackImage(null);
        setIdImage(null);
        setExperience('');
        setDescription('');
        setFacebookLink('');
        setTwitterLink('');
        setInstagramLink('');
        setLinkedinLink('');
    }

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        resetFields();
    };

    useEffect(() => {
        const button = document.querySelector('[data-bs-target="#adddoctor"]');
        if (button) {
            button.addEventListener('click', openModal);
            return () => button.removeEventListener('click', openModal);
        }
    }, []);



    const handleAddDoctor = async () => {
        //validate form fields
        if (!fullName.trim() || !email.trim() || !phone.trim() || !gender || !status || !password.trim() || password.length < 6 || password.length > 20 || !profileImage || !cardFrontImage || !cardBackImage || !idImage) {
            toast.error('Please fill in all the required fields', { autoClose: 3000 });
            return;
        }
        if (!profileImage) return;
        setLoading(true);

        //upload single image
        const uploadSingleImage = async (imageFile) => {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await axios.post('https://api.imgbb.com/1/upload?key=da1538fed0bcb5a7c0c1273fc4209307', formData);
            return response.data.data.url;
        };

        try {

            setLoading(true);
            // upload all image
            const profileUrl = await uploadSingleImage(profileImage);
            const cardFrontUrl = await uploadSingleImage(cardFrontImage);
            const cardBackUrl = await uploadSingleImage(cardBackImage);
            const idImageUrl = await uploadSingleImage(idImage);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName,
                email,
                phone,
                gender,
                status,
                profileImage: profileUrl,
                role: 'doctor',
                doctorDetails: {
                    cardFrontImage: cardFrontUrl,
                    cardBackImage: cardBackUrl,
                    idImage: idImageUrl,
                    experience,
                    description,
                    socialMedia: {
                        facebook: facebookLink,
                        twitter: twitterLink,
                        instagram: instagramLink,
                        linkedin: linkedinLink
                    }
                },
                createdAt: Timestamp.now()
            });

            await fetchDoctors();
            toast.success('Doctor added successfully', { autoClose: 3000 });
            closeModal();
        } catch (error) {
            toast.error("Failed to add doctor, error:" + error?.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }

    }
    return (
        <Fragment>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <img src={logo} width={60} height={60} alt="logo" className="rounded-lg" />
                                <h2 className="text-xl font-bold text-gray-800">Add New Doctor</h2>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>

                            {/* Status & Experience */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="">Select Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Years of Experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
                                </div>
                            </div>

                            {/* Images */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                                    <input type="file" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ID Image</label>
                                    <input type="file" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" accept="image/*" onChange={(e) => setIdImage(e.target.files[0])} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Front</label>
                                    <input type="file" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" accept="image/*" onChange={(e) => setCardFrontImage(e.target.files[0])} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Back</label>
                                    <input type="file" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" accept="image/*" onChange={(e) => setCardBackImage(e.target.files[0])} />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">About Doctor</label>
                                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" rows={4} placeholder="Enter About Doctor" maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>

                            {/* Social Media */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Social Media Links</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Facebook Link" value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} />
                                    <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Instagram Link" value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} />
                                    <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Twitter Link" value={twitterLink} onChange={(e) => setTwitterLink(e.target.value)} />
                                    <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="LinkedIn Link" value={linkedinLink} onChange={(e) => setLinkedinLink(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button type="button" onClick={handleAddDoctor} disabled={loading} className="px-6 py-2 bg-petut-brown-300 text-white rounded-lg hover:bg-petut-brown-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {loading ? <BeatLoader size={10} color='#fff' /> : 'Add Doctor'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    )
}
