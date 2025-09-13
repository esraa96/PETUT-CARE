import React, { Fragment, useState, useEffect } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { BeatLoader } from 'react-spinners';

export default function NumberClientsChart() {
    const [clientsData, setClientsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClientsData();
    }, []);

    const fetchClientsData = async () => {
        try {
            const clientsQuery = query(collection(db, 'users'), where('role', '==', 'customer'));
            const clientsSnapshot = await getDocs(clientsQuery);
            
            const monthlyData = {};
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            // Initialize all months with 0
            months.forEach(month => {
                monthlyData[month] = 0;
            });

            clientsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.createdAt && data.createdAt.seconds) {
                    const date = new Date(data.createdAt.seconds * 1000);
                    const month = months[date.getMonth()];
                    monthlyData[month]++;
                }
            });

            const chartData = months.map(month => ({
                month,
                clients: monthlyData[month]
            }));

            setClientsData(chartData);
        } catch (error) {
            console.error('Error fetching clients data:', error);
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
                <h6 className="text-gray-800 dark:text-white">Number of clients per month</h6>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={clientsData}>
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
                        <Bar dataKey="clients" fill="#D9A741" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Fragment>
    )
}