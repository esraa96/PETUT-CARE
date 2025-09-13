import { doc, setDoc, Timestamp } from "firebase/firestore";
import { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FaTimes } from 'react-icons/fa';
import logo from '../../assets/petut.png';
import { BeatLoader } from "react-spinners";
import axios from 'axios';

export default function AddAdminModal({ fetchAdmins , admins, setAdmins }) {
    const [isOpen, setIsOpen] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const resetFields = () => {
        setFullName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setProfileImage(null);
        setImageUrl('');
    }

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        resetFields();
    };

    useEffect(() => {
        const button = document.querySelector('[data-bs-target="#addadmin"]');
        if (button) {
            button.addEventListener('click', openModal);
            return () => button.removeEventListener('click', openModal);
        }
    }, []);

    const handleAddDoctor = async () => {
        //validate form fields
        if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim() || password.length < 6 || password.length > 20) {
            toast.error('Please fill in all the required fields', { autoClose: 3000 });
            return
        }

        if (!profileImage) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('image', profileImage);
        try {
            // upload image
            const response = await axios.post('https://api.imgbb.com/1/upload?key=da1538fed0bcb5a7c0c1273fc4209307', formData);

            const url = response.data.data.url;
            setImageUrl(url);
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName,
                email,
                phone,
                role: 'admin',
                profileImage: url,
                createdAt: Timestamp.now()
            });
            await fetchAdmins();
            toast.success('Admin added successfully', { autoClose: 3000 });
            closeModal();
        } catch (error) {
            toast.error("Failed to add admin, error:" + error?.message, { autoClose: 3000 });
        } finally {
            setLoading(false);
        }

    }
    return (
        <Fragment>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <img src={logo} width={60} height={60} alt="logo" className="rounded-lg" />
                                <h2 className="text-xl font-bold text-gray-800">Add New Admin</h2>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                                <input type="file" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} />
                            </div>

                            {imageUrl && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                                    <img src={imageUrl} alt="preview" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button type="button" onClick={handleAddDoctor} disabled={loading} className="px-6 py-2 bg-petut-brown-300 text-white rounded-lg hover:bg-petut-brown-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {loading ? <BeatLoader size={10} color='#fff' /> : 'Add Admin'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    )
}
