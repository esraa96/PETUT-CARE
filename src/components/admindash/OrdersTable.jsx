import React, { Fragment, useState } from 'react'
import { FaEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import ConfirmModal from '../ConfirmModal';
import ViewOrderModal from './ViewOrderModal';
import { BiSearchAlt2 } from 'react-icons/bi';

export default function OrdersTable({ orders, handleDeleteOrder, loading }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] =useState('');

  const [statusFilter, setStatusFilter] = useState('all');

  // filter orders 
  const filterOreders = orders?.filter(order => {
    const nameMatch = order?.deliveryInfo?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const priceMatch = String(order?.cart?.totalAmount).includes(searchTerm);
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    return (nameMatch || priceMatch) && statusMatch;
  })
  return (
    <Fragment>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
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
        <select className="w-full sm:w-1/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} >
          <option value="all" >All</option>
          <option value="pending" >Pending</option>
          <option value="processing" >Processing</option>
          <option value="delivered" >Delivered</option>
          <option value="cancelled" >Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className='text-center mt-8'><BeatLoader color='#D9A741' /></div>
      ) : orders.length === 0 ? (
        <div className='text-center mt-8 text-gray-600'>No orders found</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filterOreders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{order.deliveryInfo.fullName}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{order.deliveryInfo.phone}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-GB') : ''}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString() : ''}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{order.cart.totalAmount} EGP</td>
                      <td className="px-4 py-4">
                        <select className='px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded text-sm'>
                          <option value="pending">{order.paymentInfo.status}</option>
                          <option value="processing">Processing</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button type="button" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button type="button" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" onClick={() => {
                            setShowConfirm(true);
                            setSelectedOrderId(order.id);
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
          </div>
          
          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filterOreders.map(order => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {order.deliveryInfo.fullName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {order.deliveryInfo.phone}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-GB') : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {order.cart.totalAmount} EGP
                    </p>
                    <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                      order.paymentInfo.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      order.paymentInfo.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      order.paymentInfo.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {order.paymentInfo.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                  <select className='px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded text-sm'>
                    <option value="pending">{order.paymentInfo.status}</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="flex items-center space-x-2">
                    <button type="button" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 p-2">
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button type="button" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2" onClick={() => {
                      setShowConfirm(true);
                      setSelectedOrderId(order.id);
                    }}>
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {showConfirm && (<ConfirmModal onDelete={() => handleDeleteOrder(selectedOrderId)} setShowConfirm={setShowConfirm} selectedId={selectedOrderId} whatDelete="order" />)}
    </Fragment>
  )
}


