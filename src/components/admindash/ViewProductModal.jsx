import React, { Fragment } from 'react'
import { FaTimes } from 'react-icons/fa'
import logo from '../../assets/petut.png';

export default function ViewProductModal({ product, modalId, isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <Fragment>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h1 className="text-xl font-semibold text-gray-900">Product Details</h1>
                        <div className="flex items-center space-x-4">
                            <img src={logo} width={60} height={60} alt="logo" />
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-1/3">
                                <img src={product.imageURL} alt="product-image" className='w-full rounded-lg' />
                            </div>
                            <div className="lg:w-2/3 space-y-4">
                                <div><span className="font-semibold text-gray-700">Product Name:</span> <span className="text-gray-900">{product.productName}</span></div>
                                <div><span className="font-semibold text-gray-700">Description:</span> <span className="text-gray-900">{product.description}</span></div>
                                <div><span className="font-semibold text-gray-700">Price:</span> <span className="text-gray-900">${product.price}</span></div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-700">Category:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                                        product.category === 'cat' ? 'bg-purple-500' :
                                        product.category === 'dog' ? 'bg-blue-500' :
                                        product.category === 'bird' ? 'bg-green-500' :
                                        product.category === 'toys' ? 'bg-orange-500' : 'bg-purple-500'
                                    }`}>
                                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                                    </span>
                                </div>
                                <div><span className="font-semibold text-gray-700">Rate:</span> <span className="text-gray-900">{product.rate}/5</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end p-6 border-t border-gray-200">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}