import { useState } from 'react';
import {
    useAddOrderMutation,
    useAllOrderQuery,

} from '../../features/api/orderAuth/orderAuth';

import { useAllItemQuery } from '../../features/api/itemAuth/itemAuth';
import { useAllSupplierQuery } from '../../features/api/supplierAuth/supplierAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
const OrderTable = () => {
    const { data: items } = useAllItemQuery();
    const { data: suppliers } = useAllSupplierQuery();
    const { data: orders, isLoading, error, refetch } = useAllOrderQuery();
    const [addOrder] = useAddOrderMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        orderDate: '',
        itemId: '',
        supplierId: '',
        qty: '',

    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formValues.orderDate) formErrors.orderDate = "Order date is required";
        if (!formValues.itemId) formErrors.itemId = "Item is required";
        if (!formValues.supplierId) formErrors.supplierId = "Supplier is required";
        if (!formValues.qty || isNaN(formValues.qty) || formValues.qty <= 0) {
            formErrors.qty = "Quantity must be a positive number";
        }


        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleAddOrder = async () => {
        console.log("kk");

        if (!validateForm()) return;


        const orderData = { ...formValues };
        console.log(formValues, "lk");


        try {
            const response = await addOrder(orderData);
            if (response.error) {
                return toast.error(response.error.data.message);
            }

            toast.success('Order added successfully!');
            refetch();
            setIsModalOpen(false);
            setFormValues({
                orderDate: '',
                itemId: '',
                supplierId: '',
                qty: '',

            });
            setErrors({});
        } catch (error) {
            console.log("Unexpected error:", error);
            toast.error("Unexpected error occurred. Please try again.");
        }
    };
    const handleExportToExcel = () => {
        const exportData = orders?.data?.map((order, index) => ({
            "Sl No": index + 1,
            "Order Date": new Date(order.orderDate).toLocaleDateString(),
            "Item": order.itemId?.itemName || '',
            "Supplier": order.supplierId?.supplierName || '',
            "Quantity": order.qty,
            "Price": order.price,
            "Total Price": order.totalPrice,
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        XLSX.writeFile(workbook, "Orders.xlsx");
    };
    return (
        <>
            <ToastContainer />
            <div className="flex justify-end p-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    Add Order
                </button>
                <button
                    onClick={handleExportToExcel}
                    className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                >
                    Export to Excel
                </button>
            </div>

            <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
                <div className="w-full max-w-6xl">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Order List</h2>
                    {isLoading ? (
                        <p className="text-center">Loading orders...</p>
                    ) : error ? (
                        <p className="text-red-500 text-center">Failed to load orders.</p>
                    ) : (
                        <table className="table-auto w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Sl No</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Order Date</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Item</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Supplier</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Quantity</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Price</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Total Price</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Net Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders?.data?.map((order, index) => (
                                    <tr key={order.id} className="bg-white border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                                        <td className="py-3 px-4">{index + 1}</td>
                                        <td className="py-3 px-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">{order.itemId?.itemName}</td>
                                        <td className="py-3 px-4">{order.supplierId?.supplierName}</td>
                                        <td className="py-3 px-4">{order?.qty}</td>
                                        <td className="py-3 px-4">{order?.price}</td>
                                        <td className="py-3 px-4">{order?.totalPrice}</td>
                                        <td className="py-3 px-4">{order?.netAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                        <h3 className="text-xl font-semibold mb-4">Add New Order</h3>
                        <div className="space-y-4">
                            <input
                                type="date"
                                name="orderDate"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.orderDate && <p className="text-red-500">{errors.orderDate}</p>}

                            <select
                                name="itemId"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                value={formValues.itemId}
                            >
                                <option value="">Select Item</option>
                                {items?.data?.map((item) => (
                                    <option key={item._id} value={item._id}>{item?.itemName}</option>
                                ))}
                            </select>
                            {errors.itemId && <p className="text-red-500">{errors.itemId}</p>}

                            <select
                                name="supplierId"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                value={formValues.supplierId}
                            >
                                <option value="">Select Supplier</option>
                                {suppliers?.data?.map((supplier) => (
                                    <option key={supplier._id} value={supplier._id}>
                                        {supplier.supplierName}
                                    </option>
                                ))}
                            </select>
                            {errors.supplierId && <p className="text-red-500">{errors.supplierId}</p>}

                            <input
                                type="number"
                                name="qty"
                                placeholder="Quantity"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.qty && <p className="text-red-500">{errors.qty}</p>}



                        </div>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddOrder}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderTable;
