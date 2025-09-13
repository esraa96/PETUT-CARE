import React, { Fragment, useState, useEffect } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { BeatLoader } from 'react-spinners';

export default function RevenuesChart() {
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRevenueData();
    }, []);

    const fetchRevenueData = async () => {
        try {
            const ordersSnapshot = await getDocs(collection(db, 'orders'));
            
            const monthlyRevenue = {};
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            // Initialize all months with 0
            months.forEach(month => {
                monthlyRevenue[month] = 0;
            });

            ordersSnapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.createdAt && data.createdAt.seconds && data.totalAmount) {
                    const date = new Date(data.createdAt.seconds * 1000);
                    const month = months[date.getMonth()];
                    monthlyRevenue[month] += data.totalAmount;
                }
            });

            const chartData = months.map(month => ({
                month,
                revenue: Math.round(monthlyRevenue[month])
            }));

            setRevenueData(chartData);
        } catch (error) {
            console.error('Error fetching revenue data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="col-md-12 mb-4 d-flex justify-content-center align-items-center" style={{height: '500px'}}>
                <BeatLoader color="#D9A741" />
            </div>
        );
    }

    return (
        <Fragment>
            <div className="col-md-12 mb-4">
                <h6 className="text-gray-800 dark:text-white">Revenues per month</h6>
                <ResponsiveContainer width="100%" height={500}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" className="dark:stroke-gray-600" />
                        <XAxis dataKey="month" tick={{ fill: '#6B7280' }} className="dark:fill-gray-300" />
                        <YAxis tick={{ fill: '#6B7280' }} className="dark:fill-gray-300" />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: 'var(--tooltip-bg, #ffffff)',
                                border: '1px solid var(--tooltip-border, #e5e7eb)',
                                borderRadius: '8px',
                                color: 'var(--tooltip-text, #374151)'
                            }}
                        />
                        <Line type="monotone" dataKey="revenue" stroke="#D9A741" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Fragment>
    )
}