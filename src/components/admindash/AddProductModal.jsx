import React, { Fragment, useState, useEffect } from 'react';
import logo from '../../assets/petut.png';
import { toast } from 'react-toastify';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';

export default function AddProductModal({setProducts, loading, setLoading }) {
    const [isOpen, setIsOpen] = useState(false);
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [weight, setWeight] = useState('');
    const [rate, setRate] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const resetFields = () => {
        setProductName('');
        setDescription('');
        setPrice('');
        setWeight('');
        setRate('');
        setCategory('');
        setImageFile(null);
        setImageUrl('');
    }

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        resetFields();
    };

    useEffect(() => {
        const button = document.querySelector('[data-bs-target="#addproduct"]');
        if (button) {
            button.addEventListener('click', openModal);
            return () => button.removeEventListener('click', openModal);
        }
    }, []);

    // add product to firebase
    const handleAddProduct = async () => {
        setLoading(true);
        if (!productName || !description || !price || !rate || !category || !imageFile) {
            toast.error('Please fill in all the required fields', { autoClose: 3000 });
            return;
        }
        if (!imageFile) return;
        
        const formData = new FormData();
        formData.append('image', imageFile);
        
        try {
            // upload image
            const response = await axios.post('https://api.imgbb.com/1/upload?key=da1538fed0bcb5a7c0c1273fc4209307', formData);
            const url = response.data.data.url;
            setImageUrl(url);
            // // add product to firebase
            await addDoc(collection(db, 'products'), {
                productName,
                description,
                price,
                weight,
                rate,
                category,
                imageURL: url,
                createdAt: Timestamp.now()
            })
            toast.success('Product added successfully', { autoClose: 3000 });
            setProducts(products => [...products, {
                productName,
                description,
                price,
                weight,
                rate,
                category,
                imageURL: url,
                createdAt: Timestamp.now()
            }]);
            closeModal();
        } catch (error) {
            toast.error("Failed to add product, error:" + error.message, { autoClose: 3000 });
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
                                <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" rows={3} placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" placeholder="Enter Weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" value={category} onChange={(e) => setCategory(e.target.value)}>
                                        <option value="">Select Category</option>
                                        <option value="cat">Cat</option>
                                        <option value="dog">Dog</option>
                                        <option value="bird">Bird</option>
                                        <option value="toys">Toys</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" value={rate} onChange={(e) => setRate(e.target.value)}>
                                        <option value="">Select Rating</option>
                                        <option value="1">1 Star</option>
                                        <option value="1.5">1.5 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="2.5">2.5 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="3.5">3.5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="4.5">4.5 Stars</option>
                                        <option value="5">5 Stars</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                                <input type="file" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
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
                            <button type="button" onClick={handleAddProduct} disabled={loading} className="px-6 py-2 bg-petut-brown-300 text-white rounded-lg hover:bg-petut-brown-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                {loading ? <BeatLoader size={10} color='#fff' /> : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    )
}
