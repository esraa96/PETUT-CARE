import React, { Fragment, useState, useEffect } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { BeatLoader } from 'react-spinners';

export default function NumberClinicsChart() {
    const [clinicsData, setClinicsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const COLORS = ['#D9A741', '#8884d8', '#82ca9d', '#FF8042', '#0088FE', '#00C49F'];

    useEffect(() => {
        fetchClinicsData();
    }, []);

    const fetchClinicsData = async () => {
        try {
            const clinicsSnapshot = await getDocs(collection(db, 'clinics'));
            
            const specialtyCount = {};
            
            clinicsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                const specialty = data.specialty || 'General';
                specialtyCount[specialty] = (specialtyCount[specialty] || 0) + 1;
            });

            const chartData = Object.entries(specialtyCount).map(([name, value]) => ({
                name,
                value
            }));

            setClinicsData(chartData);
        } catch (error) {
            console.error('Error fetching clinics data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="col-md-12 mx-auto mb-4 d-flex justify-content-center align-items-center" style={{height: '400px'}}>
                <BeatLoader color="#D9A741" />
            </div>
        );
    }

    return (
        <Fragment>
            <div className="col-md-12 mx-auto mb-4">
                <h6 className="text-gray-800 dark:text-white">Number of clinics by specialty</h6>
                <ResponsiveContainer width="100%" height={400} >
                    <PieChart className='border-0'>
                        <Pie
                            data={clinicsData}
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {clinicsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: 'var(--tooltip-bg, #ffffff)',
                                border: '1px solid var(--tooltip-border, #e5e7eb)',
                                borderRadius: '8px',
                                color: 'var(--tooltip-text, #374151)'
                            }}
                        />
                        <Legend 
                            wrapperStyle={{
                                color: 'var(--legend-text, #374151)'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Fragment>
    )
}