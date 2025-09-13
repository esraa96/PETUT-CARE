import React, { Fragment, useEffect, useState } from 'react'
import { TbEdit } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa"; 
import ViewProductModal from './ViewProductModal';
import EditProductModal from './EditProductModal';
import ConfirmModal from '../ConfirmModal';
import { BeatLoader } from 'react-spinners';
import { BiSearchAlt2 } from "react-icons/bi";

export default function ProductsTable({ products, setProducts, handleDeleteProduct, loading }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const filterProducts = products?.filter(product => {
        const nameMatch = product?.productName?.toLowerCase().includes(searchTerm.toLowerCase());
        const priceMatch = String(product?.price).includes(searchTerm);
        const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter;
        return (nameMatch || priceMatch) && categoryMatch;
    })

    return (
        <Fragment>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 my-3">
                <div className="relative w-full sm:w-2/5">
                    <input
                        className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300"
                        type="text"
                        placeholder="Search by name, Price"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <BiSearchAlt2
                        size={20}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                </div>
                <select className="w-full sm:w-1/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} >
                    <option value="all" >All</option>
                    <option value="cat" >Cat</option>
                    <option value="dog" >Dog</option>
                    <option value="bird" >Bird</option>
                    <option value="toys" >Toys</option>
                </select>
            </div>
            {loading ? (
                <div className='text-center mt-8'><BeatLoader color='#D9A741' /></div>
            ) : products?.length === 0 ? (
                <div className='text-center mt-8 text-gray-600 dark:text-gray-400'>No products found</div>
            ) : filterProducts?.length === 0 ? (
                <div className='text-center mt-8 text-gray-600 dark:text-gray-400'>No Match products found</div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden sm:table-cell">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden lg:table-cell">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden md:table-cell">Rate</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase hidden sm:table-cell">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filterProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{product.productName}</td>
                                        <td className="px-4 py-4 hidden sm:table-cell">
                                            <img src={product.imageURL} alt="product-image" className="w-16 h-16 object-cover rounded-lg" />
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 hidden lg:table-cell">
                                            {product.description?.split(' ').length > 3
                                                ? product.description.split(' ').slice(0, 3).join(' ') + '...'
                                                : product.description}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">${product.price}</td>
                                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 hidden md:table-cell">{product.rate}</td>
                                        <td className="px-4 py-4 hidden sm:table-cell">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                                                product.category === 'cat' ? 'bg-purple-500' :
                                                product.category === 'dog' ? 'bg-blue-500' :
                                                product.category === 'bird' ? 'bg-green-500' :
                                                product.category === 'toys' ? 'bg-orange-500' : 'bg-purple-500'
                                            }`}>
                                                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button type="button" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100" onClick={() => {
                                                    setSelectedProduct(product);
                                                    setViewModalOpen(true);
                                                }}>
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                <button type="button" className="text-petut-brown-300 hover:text-petut-brown-400">
                                                    <TbEdit className="w-4 h-4" />
                                                </button>

                                                <button type="button" className="text-red-600 hover:text-red-800" onClick={() => {
                                                    setShowConfirm(true);
                                                    setSelectedProductId(product.id);
                                                }}>
                                                    <MdDelete className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {showConfirm && (<ConfirmModal onDelete={() => handleDeleteProduct(selectedProductId)} setShowConfirm={setShowConfirm} selectedId={selectedProductId} whatDelete="Product" />)}
                    {viewModalOpen && selectedProduct && (
                        <ViewProductModal 
                            product={selectedProduct} 
                            isOpen={viewModalOpen} 
                            onClose={() => {
                                setViewModalOpen(false);
                                setSelectedProduct(null);
                            }} 
                        />
                    )}
                </div>
            )}
        </Fragment>
    )
}