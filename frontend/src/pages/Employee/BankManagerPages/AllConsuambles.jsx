import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApexCharts from 'apexcharts';
import useInventoryStore from '../../../store/assetsStore';
import { BsCreditCard2Front, BsPlusCircle } from 'react-icons/bs';

const AllConsumables = () => {
    const { consumables, fetchConsumables, isLoading, error } = useInventoryStore();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const chartRef = useRef(null);

    useEffect(() => {
        fetchConsumables();
    }, []);

    useEffect(() => {
        if (consumables.length > 0 && chartRef.current) {
            // Group consumables by category and sum their quantities
            const categoryCount = consumables.reduce((acc, item) => {
                const category = item.category || 'Uncategorized';
                acc[category] = (acc[category] || 0) + (parseInt(item.quantity) || 0);
                return acc;
            }, {});

            const categories = Object.keys(categoryCount);
            const counts = Object.values(categoryCount);

            const chartOptions = {
                series: [{
                    name: 'Quantity',
                    data: counts
                }],
                chart: {
                    type: 'bar',
                    height: 350,
                    toolbar: {
                        show: true
                    }
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        borderRadius: 5,
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val.toFixed(0);
                    }
                },
                title: {
                    text: 'Consumables by Category',
                    align: 'center',
                    style: {
                        fontSize: '18px'
                    }
                },
                xaxis: {
                    categories: categories,
                    title: {
                        text: 'Categories'
                    },
                    labels: {
                        rotate: -45,
                        style: {
                            fontSize: '12px'
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: 'Total Quantity'
                    }
                },
                fill: {
                    opacity: 0.8,
                    colors: ['#2563eb']
                },
                theme: {
                    mode: 'light'
                }
            };

            // Initialize chart
            const chart = new ApexCharts(chartRef.current, chartOptions);
            chart.render();

            // Cleanup function
            return () => {
                chart.destroy();
            };
        }
    }, [consumables]);

    // Pagination logic
    const totalConsumables = consumables.length;
    const startIndex = currentPage * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalConsumables);
    const paginatedConsumables = consumables.slice(startIndex, endIndex);

    const nextPage = () => {
        if (endIndex < totalConsumables) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className="space-y-4">
            {/* Chart Section */}
            <div className="p-4 bg-white shadow-md rounded-lg">
                {!isLoading && consumables.length > 0 && (
                    <div ref={chartRef}></div>
                )}
            </div>

            {/* Table Section */}
            <div className="p-4 bg-white shadow-md rounded-lg">
                <div className="flex justify-end items-center mb-6">
                    <button
                        onClick={() => navigate('/employee/bank-manager/add-consumable')}
                        className="flex items-center gap-2 border border-gray-800 text-gray-800 bg-white px-4 py-2 rounded hover:bg-gray-800 hover:text-white disabled:bg-gray-400"
                    >
                        <BsPlusCircle size={20} />
                        <span>Add New Consumable</span>
                    </button>
                </div>

                {isLoading && <div className="text-center py-4">Loading consumables...</div>}
                {error && <div className="text-red-500 text-center py-4">{error}</div>}

                {!isLoading && consumables.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-600 text-white">
                                        <th className="p-2">Consumable Name</th>
                                        <th className="p-2">Category</th>
                                        <th className="p-2">Quantity</th>
                                        <th className="p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedConsumables.map((item) => (
                                        <tr key={item.consumable_id} className="border-b border-gray-200 even:bg-gray-100">
                                            <td className="p-2">{item.name}</td>
                                            <td className="p-2">{item.category}</td>
                                            <td className="p-2">{item.quantity}</td>
                                            <td className="p-2">
                                                <button
                                                    onClick={() => navigate(`/employee/bank-manager/consumable/${item.consumable_id}`)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center mt-4 text-sm">
                            <div className="flex items-center">
                                <span className="mr-2">Rows per page:</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(parseInt(e.target.value));
                                        setCurrentPage(0);
                                    }}
                                    className="border rounded-md p-1 text-sm"
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                </select>
                            </div>
                            <span>
                                {startIndex + 1}-{endIndex} of {totalConsumables}
                            </span>
                            <div>
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 0}
                                    className={`mr-2 px-3 py-1 rounded-md ${
                                        currentPage === 0 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white"
                                    }`}
                                >
                                    ← Previous
                                </button>
                                <button
                                    onClick={nextPage}
                                    disabled={endIndex >= totalConsumables}
                                    className={`px-3 py-1 rounded-md ${
                                        endIndex >= totalConsumables ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white"
                                    }`}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    !isLoading && <div className="text-center text-gray-500 py-4">No consumables found.</div>
                )}
            </div>
        </div>
    );
};

export default AllConsumables;