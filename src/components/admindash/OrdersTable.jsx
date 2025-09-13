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
        <div className="bg-white shadow rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterOreders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">{order.deliveryInfo.fullName}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 hidden sm:table-cell">{order.deliveryInfo.phone}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 hidden md:table-cell">{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-GB') : ''}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 hidden lg:table-cell">{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString() : ''}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{order.cart.totalAmount} EGP</td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <select className='px-2 py-1 border border-gray-300 rounded text-sm'>
                        <option value="pending">{order.paymentInfo.status}</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button type="button" className="text-gray-600 hover:text-gray-900">
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button type="button" className="text-red-600 hover:text-red-800" onClick={() => {
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
          {showConfirm && (<ConfirmModal onDelete={() => handleDeleteOrder(selectedOrderId)} setShowConfirm={setShowConfirm} selectedId={selectedOrderId} whatDelete="order" />)}
        </div>
      )}

    </Fragment>
  )
}


