import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import SupportTicketsTable from '../../components/admindash/SupportTicketsTable';
import { RiCustomerService2Line, RiMessage3Line, RiTimeLine, RiCheckLine } from 'react-icons/ri';

export default function SupportPage() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'support_tickets'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const tickets = snapshot.docs.map(doc => doc.data());
        
        setStats({
          total: tickets.length,
          open: tickets.filter(t => t.status === 'open').length,
          inProgress: tickets.filter(t => t.status === 'in_progress').length,
          resolved: tickets.filter(t => t.status === 'resolved').length
        });
      },
      (error) => {
        console.error('Error fetching support stats:', error);
        // Keep default stats if error occurs
        setStats({
          total: 0,
          open: 0,
          inProgress: 0,
          resolved: 0
        });
      }
    );

    return () => unsubscribe();
  }, []);

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.total,
      icon: RiCustomerService2Line,
      color: 'bg-yellow-400',
      description: 'All support tickets'
    },
    {
      title: 'Open Tickets',
      value: stats.open,
      icon: RiMessage3Line,
      color: 'bg-yellow-400',
      description: 'Need response'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: RiTimeLine,
      color: 'bg-yellow-400',
      description: 'Being worked on'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: RiCheckLine,
      color: 'bg-yellow-400',
      description: 'Successfully resolved'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">Support Management</h1>
        <p className='text-black dark:text-white'>Manage customer support tickets and inquiries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-black dark:text-white mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-black dark:text-white mb-1">{stat.value}</p>
                <p className="text-xs text-black dark:text-white">{stat.description}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-full shadow-lg`}>
                <stat.icon className="text-2xl text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Support Tickets Table */}
      <SupportTicketsTable />
    </div>
  );
}