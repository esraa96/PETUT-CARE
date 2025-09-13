import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase.js'
import LoadingAnimation from "../common/LoadingAnimation.jsx";

const DoctorForm = () => {
    const [searchParams] = useSearchParams()
    const uid = searchParams.get('uid')
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullName: auth.currentUser?.displayName || '',
        email: auth.currentUser?.email || '',
        phone: auth.currentUser?.phone || '',
        gender: auth.currentUser?.gender || '',
        role: 'doctor',
        status: 'pending',
        doctorDetails: {
            cardBackImage: "",
            cardFrontImage: "",
            description: "",
            experience: "",
            idImage: "",
            socialMedia: {
                facebook: "",
                instagram: "",
                twitter: "",
                linkedin: ""
            }
        }
    })

    useEffect(() => {
        const fetchUserData = async () => {
            if (uid) {
                const userDocRef = doc(db, "users", uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    // Merge fetched data with existing state, preserving nested structures
                    setFormData(prev => ({
                        ...prev,
                        ...userData,
                        doctorDetails: {
                            ...prev.doctorDetails,
                            ...(userData.doctorDetails || {})
                        },
                    }));
                }
            }
        };
        fetchUserData();
    }, [uid]);

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [formErrors, setFormErrors] = useState({});

    const handleChange = e => {
        const { name, value, type, files } = e.target;

        const keys = name.split('.');
        const file = type === 'file' ? files[0] : value;

        // Helper function to recursively update nested state
        const updateNestedState = (prevState, keys, file) => {
            const newState = { ...prevState };
            let current = newState;

            for (let i = 0; i < keys.length - 1; i++) {
                // Create nested objects if they don't exist
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = file;
            return newState;
        };

        setFormData(prev => updateNestedState(prev, keys, file));

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    }

    const validateForm = () => {
        const errors = {};
        const { fullName, phone, gender, doctorDetails } = formData;

        if (!fullName.trim()) errors.fullName = "Full name is required";
        if (!phone.trim()) {
            errors.phone = "Phone number is required";
        } else if (!/^(\+20|0)1[0125]\d{8}$/.test(phone)) {
            errors.phone = "Please enter a valid Egyptian phone number";
        }
        if (!gender) errors.gender = "Gender is required";
        if (!doctorDetails.description.trim()) errors['doctorDetails.description'] = "Description is required";
        if (!doctorDetails.experience) {
            errors['doctorDetails.experience'] = "Years of experience are required";
        } else if (doctorDetails.experience <= 0) {
            errors['doctorDetails.experience'] = "Experience must be a positive number";
        }
        
        // Validate file uploads
        if (!doctorDetails.cardFrontImage) {
            errors['doctorDetails.cardFrontImage'] = "Syndicate card front image is required";
        } else if (doctorDetails.cardFrontImage.size > 5 * 1024 * 1024) {
            errors['doctorDetails.cardFrontImage'] = "Image size must be less than 5MB";
        }
        
        if (!doctorDetails.cardBackImage) {
            errors['doctorDetails.cardBackImage'] = "Syndicate card back image is required";
        } else if (doctorDetails.cardBackImage.size > 5 * 1024 * 1024) {
            errors['doctorDetails.cardBackImage'] = "Image size must be less than 5MB";
        }
        
        if (!doctorDetails.idImage) {
            errors['doctorDetails.idImage'] = "ID image is required";
        } else if (doctorDetails.idImage.size > 5 * 1024 * 1024) {
            errors['doctorDetails.idImage'] = "Image size must be less than 5MB";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return;

        setLoading(true)
        setError('')

        const { description, experience, cardFrontImage, cardBackImage, idImage } = formData.doctorDetails;
        if (!description || !experience || !cardFrontImage || !cardBackImage || !idImage) {
            setError('Please fill out all required fields and upload all required images.');
            return;
        }

        const uploadToImgBB = async (file) => {
            // Use environment variable for API key
            const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
            if (!apiKey) {
                throw new Error('Image upload service not configured. Please check VITE_IMGBB_API_KEY.');
            }
            
            if (!file) {
                throw new Error('No file selected for upload');
            }
            
            const body = new FormData();
            body.append("image", file);

            try {
                const response = await fetch(
                    `https://api.imgbb.com/1/upload?key=${apiKey}`,
                    {
                        method: "POST",
                        body: body,
                    }
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                if (!data.success || !data.data?.url) {
                    throw new Error(data.error?.message || 'Image upload failed - no URL returned');
                }
                return data.data.url;
            } catch (error) {
                console.error('Image upload error:', error);
                throw new Error(`Image upload failed: ${error.message}`);
            }
        };

        try {
            console.log('Starting image uploads...');
            const cardFrontImageUrl = await uploadToImgBB(cardFrontImage);
            console.log('Card front uploaded successfully');
            
            const cardBackImageUrl = await uploadToImgBB(cardBackImage);
            console.log('Card back uploaded successfully');
            
            const idImageUrl = await uploadToImgBB(idImage);
            console.log('ID image uploaded successfully');

            const finalFormData = {
                ...formData,
                doctorDetails: {
                    ...formData.doctorDetails,
                    cardFrontImage: cardFrontImageUrl,
                    cardBackImage: cardBackImageUrl,
                    idImage: idImageUrl,
                }
            };

            await setDoc(doc(db, "users", uid), {
                ...finalFormData,
                createdAt: serverTimestamp()
            })
            
            // Create notification for admin
            await setDoc(doc(db, "notifications", `doctor_${uid}_${Date.now()}`), {
                type: 'new_doctor_registration',
                doctorId: uid,
                doctorName: finalFormData.fullName,
                doctorEmail: finalFormData.email,
                message: `New doctor ${finalFormData.fullName} has registered and is pending approval`,
                read: false,
                createdAt: serverTimestamp(),
                targetRole: 'admin'
            })
            
            navigate('/')
        } catch (err) {
            console.error('Profile completion error:', err);
            let errorMessage = 'Failed to complete profile. ';
            
            if (err.message.includes('Image upload')) {
                errorMessage += 'Please check your internet connection and try uploading smaller images.';
            } else if (err.message.includes('permission-denied')) {
                errorMessage += 'Permission denied. Please try logging out and back in.';
            } else if (err.message.includes('network')) {
                errorMessage += 'Network error. Please check your connection.';
            } else {
                errorMessage += err.message || 'Please try again later.';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }
    const loadingHandler = () => {
        setLoading(true);
        setError('');
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    if (loading) {
        return <LoadingAnimation />
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#313340] p-6 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary_app">PET.CARE</h1>
                    <h2 className="mt-6 text-2xl font-bold dark:text-white">Complete your doctor profile</h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Full Name</label>
                            <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange}
                                   className={`appearance-none block w-full px-3 py-3 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:placeholder:text-white  dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm`}
                                   placeholder="Full Name" />
                            {formErrors.fullName && <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Email</label>
                            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                                   className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-500 dark:placeholder:text-white  dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm"
                                   placeholder="Email" disabled />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Phone</label>
                            <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange}
                                   className={`appearance-none block w-full px-3 py-3 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:placeholder:text-white  dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm`}
                                   placeholder="Phone Number" />
                            {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Gender</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-3 border ${formErrors.gender ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:placeholder:text-white  dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm`}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {formErrors.gender && <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="sr-only">Description</label>
                        <textarea id="description" name="doctorDetails.description" value={formData.doctorDetails.description} onChange={handleChange} className={`appearance-none block w-full px-3 py-3 border ${formErrors['doctorDetails.description'] ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:placeholder:text-white dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm`} placeholder="Description" required />
                        {formErrors['doctorDetails.description'] && <p className="mt-1 text-sm text-red-500">{formErrors['doctorDetails.description']}</p>}
                    </div>
                    <div>
                        <label htmlFor="experience" className="sr-only">Years of Experience</label>
                        <input id="experience" name="doctorDetails.experience" type="number" value={formData.doctorDetails.experience} onChange={handleChange} className={`appearance-none block w-full px-3 py-3 border ${formErrors['doctorDetails.experience'] ? 'border-red-500' : 'border-gray-300'} dark:border-gray-500 dark:placeholder:text-white dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm`} placeholder="Years of Experience" required />
                        {formErrors['doctorDetails.experience'] && <p className="mt-1 text-sm text-red-500">{formErrors['doctorDetails.experience']}</p>}
                    </div>
                    <div>
                        <label htmlFor="cardFrontImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Syndicate Card Front</label>
                        <input id="cardFrontImage" name="doctorDetails.cardFrontImage" type="file" onChange={handleChange} className={`block w-full text-sm text-gray-900 border ${formErrors['doctorDetails.cardFrontImage'] ? 'border-red-500' : 'border-gray-300'} rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`} aria-describedby="user_avatar_help" required />
                        {formErrors['doctorDetails.cardFrontImage'] && <p className="mt-1 text-sm text-red-500">{formErrors['doctorDetails.cardFrontImage']}</p>}
                    </div>
                    <div>
                        <label htmlFor="cardBackImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Syndicate Card Back</label>
                        <input id="cardBackImage" name="doctorDetails.cardBackImage" type="file" onChange={handleChange} className={`block w-full text-sm text-gray-900 border ${formErrors['doctorDetails.cardBackImage'] ? 'border-red-500' : 'border-gray-300'} rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`} aria-describedby="user_avatar_help" required />
                        {formErrors['doctorDetails.cardBackImage'] && <p className="mt-1 text-sm text-red-500">{formErrors['doctorDetails.cardBackImage']}</p>}
                    </div>
                    <div>
                        <label htmlFor="idImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID Image</label>
                        <input id="idImage" name="doctorDetails.idImage" type="file" onChange={handleChange} className={`block w-full text-sm text-gray-900 border ${formErrors['doctorDetails.idImage'] ? 'border-red-500' : 'border-gray-300'} rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`} aria-describedby="user_avatar_help" required />
                        {formErrors['doctorDetails.idImage'] && <p className="mt-1 text-sm text-red-500">{formErrors['doctorDetails.idImage']}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="facebook" className="sr-only">Facebook</label>
                            <input id="facebook" name="doctorDetails.socialMedia.facebook" value={formData.doctorDetails.socialMedia.facebook} onChange={handleChange} className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-500 dark:placeholder:text-white  dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm" placeholder="Facebook URL" />
                        </div>
                        <div>
                            <label htmlFor="instagram" className="sr-only">Instagram</label>
                            <input id="instagram" name="doctorDetails.socialMedia.instagram" value={formData.doctorDetails.socialMedia.instagram} onChange={handleChange} className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-500 dark:placeholder:text-white  dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm" placeholder="Instagram URL" />
                        </div>
                        <div>
                            <label htmlFor="twitter" className="sr-only">Twitter</label>
                            <input id="twitter" name="doctorDetails.socialMedia.twitter" value={formData.doctorDetails.socialMedia.twitter} onChange={handleChange} className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-500 dark:placeholder:text-white  dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm" placeholder="Twitter URL" />
                        </div>
                        <div>
                            <label htmlFor="linkedin" className="sr-only">LinkedIn</label>
                            <input id="linkedin" name="doctorDetails.socialMedia.linkedin" value={formData.doctorDetails.socialMedia.linkedin} onChange={handleChange} className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-500 dark:placeholder:text-white  dark:bg-[#313340] dark:text-white rounded-lg focus:outline-none focus:ring-primary_app focus:border-primary sm:text-sm" placeholder="LinkedIn URL" />
                        </div>
                    </div>
                    <div>
                        <button type="submit" disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-primary_app hover:bg-primary_app/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary_app disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                            {loading ? (
                                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Saving...
                </span>
                            ) : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default DoctorForm