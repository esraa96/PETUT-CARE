import React, { Fragment, useEffect, useState } from 'react'
import { RiAddLine } from "react-icons/ri";
import AddProductModal from '../../components/admindash/AddProductModal';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import ProductsTable from './../../components/admindash/ProductsTable';
import logo from '../../assets/petut.png';
import OrdersTable from '../../components/admindash/OrdersTable.jsx';




export default function Store() {
    const [products, setProducts] = useState([]);
    const [productLoading, setProductLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [orderLoading, setOrderLoading] = useState(true);



    //get products from firebase
    useEffect(() => {
        const fetchProducts = async () => {
            setProductLoading(true);
            try {

                const productsRef = collection(db, 'products');
                const q = query(productsRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productsData);
            } catch (error) {
                toast.error("Failed to fetch products, error:" + error.message, { autoClose: 3000 });
            } finally {
                setProductLoading(false);
            }
        }
        fetchProducts();
    }, [])



    // //get orders from firebase
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersRef = collection(db, 'orders');
                const q = query(ordersRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(ordersData);
            } catch (error) {
                toast.error("Failed to fetch products, error:" + error.message, { autoClose: 3000 });
            } finally {
                setOrderLoading(false);
            }
        }
        fetchOrders();
    }, [])




    //delete product from firebase
    const handleDeleteProduct = async (id) => {
        try {
            await deleteDoc(doc(db, "products", id));
            toast.success("Product deleted successfully", { autoClose: 3000 });
            setProducts(products => products.filter(product => product.id !== id));
            setProductLoading(true);

        } catch (error) {
            toast.error("Failed to delete product, error:" + error.message, { autoClose: 3000 });
        }
    }
    //delete order from firebase
    const handleDeleteOrder = async (id) => {
        try {
            await deleteDoc(doc(db, "orders", id));
            toast.success("Order deleted successfully", { autoClose: 3000 });
            setOrders(orders => orders.filter(order => order.id !== id));
            setOrderLoading(true);

        } catch (error) {
            toast.error("Failed to delete order, error:" + error.message, { autoClose: 3000 });
        }
    }



    return (
        <Fragment>
            <div className="p-4 lg:p-6 space-y-8 bg-white dark:bg-gray-900 min-h-screen">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-black dark:text-white">Orders</h1>
                        <p className="text-black dark:text-white">Managing all Orders will be done in the store page</p>
                    </div>
                    <div>
                        <img src={logo} width={80} height={80} alt="logo" className="rounded-lg" />
                    </div>
                </div>
                
                {orderLoading ? (
                    <div className='text-center mt-8'><BeatLoader color='#D9A741' /></div>
                ) : orders.length === 0 ? (
                    <div className='text-center mt-8 text-black dark:text-white'>No orders found</div>
                ) : (
                    <OrdersTable orders={orders} setOrders={setOrders} handleDeleteOrder={handleDeleteOrder} loading={orderLoading} setLoading={setOrderLoading} />
                )}

                <div className="border-t border-gray-200 dark:border-gray-600 pt-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-black dark:text-white">Products</h1>
                            <p className="text-black dark:text-white">Managing all Products will be done in the store page</p>
                        </div>
                        <button 
                            className='bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 font-semibold'
                            data-bs-toggle="modal" 
                            data-bs-target="#addproduct"
                        >
                            <RiAddLine size={20} /> Add Product
                        </button>
                    </div>
                    
                    <AddProductModal products={products} setProducts={setProducts} />
                    
                    {productLoading ? (
                        <div className='text-center mt-8'><BeatLoader color='#D9A741' /></div>
                    ) : products?.length === 0 ? (
                        <div className='text-center mt-8 text-black dark:text-white'>No Products found</div>
                    ) : (
                        <ProductsTable products={products} setProducts={setProducts} handleDeleteProduct={handleDeleteProduct} loading={productLoading} setLoading={setProductLoading} />
                    )}
                </div>
            </div>
        </Fragment>
    )
}
