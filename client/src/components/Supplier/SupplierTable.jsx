import React, { useState, useMemo } from 'react';
import { useAllSupplierQuery, useAddSupplierMutation } from "../../features/api/supplierAuth/supplierAuth";
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SupplierTable = () => {
    const { data: suppliers, isLoading, error, refetch } = useAllSupplierQuery();
    const [addSupplier] = useAddSupplierMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        supplierName: '',
        address: '',
        email: '',
        phone: '',
        taxNo: '',
        country: '',
    });
    const [errors, setErrors] = useState({});
    
    // Load country options using useMemo to avoid recalculating on every render
    const countryOptions = useMemo(() => countryList().getData(), []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleCountryChange = (selectedOption) => {
        setFormValues({ ...formValues, country: selectedOption.label });
    };

    // Validation function
    const validateForm = () => {
        let formErrors = {};

        if (!formValues.supplierName) formErrors.supplierName = "Supplier name is required";
        if (!formValues.address) formErrors.address = "Address is required";
        if (!formValues.email) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
            formErrors.email = "Email address is invalid";
        }
        if (!formValues.phone) {
            formErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formValues.phone)) {
            formErrors.phone = "Phone number should be 10 digits";
        }
        if (!formValues.taxNo) formErrors.taxNo = "Tax number is required";
        if (!formValues.country) formErrors.country = "Country is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleAddSupplier = async () => {
        if (!validateForm()) return;

        try {
            const response = await addSupplier(formValues);

            if (response.error) {
                const { status, message } = response.error;
                if (status === 400) {
                    return toast.error(response.error.data.message);
                } else {
                    return toast.error("An error occurred while adding the supplier.");
                }
            }

            toast.success('Supplier added successfully!');
            refetch();
            setIsModalOpen(false);
            setFormValues({
                supplierName: '',
                address: '',
                email: '',
                phone: '',
                taxNo: '',
                country: '',
            });
            setErrors({});
        } catch (error) {
            console.log("Unexpected error:", error);
            toast.error("Unexpected error occurred. Please try again.");
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="flex justify-end p-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    Add Supplier
                </button>
            </div>

            <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
                <div className="w-full max-w-6xl">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Supplier List</h2>
                    {isLoading ? (
                        <p className="text-center">Loading suppliers...</p>
                    ) : error ? (
                        <p className="text-red-500 text-center">Failed to load suppliers.</p>
                    ) : (
                        <table className="table-auto w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Sl No</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Email</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Phone</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Tax No</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Country</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Supplier No</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers?.data?.map((supplier, index) => (
                                    <tr key={supplier.id} className="bg-white border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                                        <td className="py-3 px-4">{index + 1}</td>
                                        <td className="py-3 px-4">{supplier?.supplierName}</td>
                                        <td className="py-3 px-4">{supplier?.email}</td>
                                        <td className="py-3 px-4">{supplier?.phone}</td>
                                        <td className="py-3 px-4">{supplier?.taxNo}</td>
                                        <td className="py-3 px-4">{supplier?.country}</td>
                                        <td className="py-3 px-4">{supplier?.supplierNo}</td>
                                        <td className="py-3 px-4">
                                            {supplier?.status ? 'Active' : 'Inactive'}
                                        </td>
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
                        <h3 className="text-xl font-semibold mb-4">Add New Supplier</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="supplierName"
                                placeholder="Supplier Name"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.supplierName && <p className="text-red-500">{errors.supplierName}</p>}
                            <textarea
                                type="text"
                                name="address"
                                placeholder="Supplier Address"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.address && <p className="text-red-500">{errors.address}</p>}
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                            <input
                                type="text"
                                name="taxNo"
                                placeholder="Tax No"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.taxNo && <p className="text-red-500">{errors.taxNo}</p>}
                            <Select
                                options={countryOptions}
                                onChange={handleCountryChange}
                                placeholder="Select Country"
                                className="w-full"
                            />
                            {errors.country && <p className="text-red-500">{errors.country}</p>}
                        </div>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSupplier}
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

export default SupplierTable;
