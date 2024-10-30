import { useState } from 'react';
import { useAddItemMutation, useAllItemQuery } from '../../features/api/itemAuth/itemAuth';
import { useAllSupplierQuery } from '../../features/api/supplierAuth/supplierAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ItemTable = () => {
    const { data: items, isLoading, error, refetch } = useAllItemQuery();
    const { data: suppliers } = useAllSupplierQuery();
    const [addItem] = useAddItemMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        itemName: '',
        inventoryLocation: '',
        brand: '',
        category: '',
        stock: '',
        price: '',
        discountPrice: '',
        supplierId: '',
        imageUrl: [],
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormValues({ ...formValues, imageUrl: files });
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formValues.itemName) formErrors.itemName = "Item name is required";
        if (!formValues.inventoryLocation) formErrors.inventoryLocation = "Inventory location is required";
        if (!formValues.brand) formErrors.brand = "Brand is required";
        if (!formValues.category) formErrors.category = "Category is required";
        if (!formValues.stock) {
            formErrors.stock = "Stock quantity is required";
        } else if (isNaN(formValues.stock) || formValues.stock <= 0) {
            formErrors.stock = "Stock must be a positive number";
        }
        if (!formValues.price) {
            formErrors.price = "Price is required";
        } else if (isNaN(formValues.price) || formValues.price <= 0) {
            formErrors.price = "Price must be a positive number";
        }
        if (formValues.discountPrice && (isNaN(formValues.discountPrice) || formValues.discountPrice < 0)) {
            formErrors.discountPrice = "Discount price must be a non-negative number";
        }
        if (!formValues.supplierId) formErrors.supplierId = "Supplier is required";
        if (formValues.imageUrl.length === 0) formErrors.imageUrl = "At least one image is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleAddItem = async () => {
        if (!validateForm()) return;

        const formData = new FormData();
        Object.keys(formValues).forEach(key => {
            if (key === 'imageUrl') {
                formValues.imageUrl.forEach(file => formData.append('imageUrl', file));
            } else {
                formData.append(key, formValues[key]);
            }
        });

        try {
            const response = await addItem(formData);

            if (response.error) {
                const { status } = response.error;
                if (status === 400) {
                    return toast.error(response.error.data.message);
                } else {
                    return toast.error("An error occurred while adding the item.");
                }
            }

            toast.success('Item added successfully!');
            refetch();
            setIsModalOpen(false);
            setFormValues({
                itemName: '',
                inventoryLocation: '',
                brand: '',
                category: '',
                stock: '',
                price: '',
                discountPrice: '',
                supplierId: '',
                imageUrl: [],
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
                    Add Item
                </button>
            </div>

            <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
                <div className="w-full max-w-6xl">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Item List</h2>
                    {isLoading ? (
                        <p className="text-center">Loading items...</p>
                    ) : error ? (
                        <p className="text-red-500 text-center">Failed to load items.</p>
                    ) : (
                        <table className="table-auto w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Sl No</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Item Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Location</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Brand</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Category</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Stock</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Price</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Discount Price</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Supplier Name</th>

                                    <th className="py-3 px-4 text-left text-sm font-semibold">Image</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.data?.map((item, index) => (
                                    <tr key={item.id} className="bg-white border-b border-gray-200 hover:bg-gray-100 transition duration-300">
                                        <td className="py-3 px-4">{index + 1}</td>
                                        <td className="py-3 px-4">{item?.itemName}</td>
                                        <td className="py-3 px-4">{item?.inventoryLocation}</td>
                                        <td className="py-3 px-4">{item?.brand}</td>
                                        <td className="py-3 px-4">{item?.category}</td>
                                        <td className="py-3 px-4">{item?.stock}</td>
                                        <td className="py-3 px-4">{item?.price}</td>
                                        <td className="py-3 px-4">{item?.discountPrice}</td>
                                        <td className="py-3 px-4">{item?.supplierId?.supplierName}</td>
                                        <td className="py-3 px-4"><img style={{ width: '30px', height: '90px' }} src={item?.itemImage[0]} alt={item?.itemName} /></td>
                                        <td className="py-3 px-4">{item?.status==true?'Active':'In Active'}</td>
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
                        <h3 className="text-xl font-semibold mb-4">Add New Item</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="itemName"
                                placeholder="Item Name"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.itemName && <p className="text-red-500">{errors.itemName}</p>}

                            <input
                                type="text"
                                name="inventoryLocation"
                                placeholder="Inventory Location"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.inventoryLocation && <p className="text-red-500">{errors.inventoryLocation}</p>}

                            <input
                                type="text"
                                name="brand"
                                placeholder="Brand"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.brand && <p className="text-red-500">{errors.brand}</p>}

                            <input
                                type="text"
                                name="category"
                                placeholder="Category"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.category && <p className="text-red-500">{errors.category}</p>}

                            <input
                                type="number"
                                name="stock"
                                placeholder="Stock"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.stock && <p className="text-red-500">{errors.stock}</p>}

                            <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.price && <p className="text-red-500">{errors.price}</p>}

                            <input
                                type="number"
                                name="discountPrice"
                                placeholder="Discount Price (optional)"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.discountPrice && <p className="text-red-500">{errors.discountPrice}</p>}

                            <select
                                name="supplierId"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                value={formValues.supplierId}
                            >
                                <option value="">Select Supplier</option>
                                {suppliers?.data?.map((supplier) => (
                                    <option key={supplier._id} value={supplier._id}>
                                        {supplier?.supplierName}
                                    </option>
                                ))}
                            </select>
                            {errors.supplierId && <p className="text-red-500">{errors.supplierId}</p>}

                            <input
                                type="file"
                                name="imageUrl"
                                multiple
                                onChange={handleImageChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {errors.imageUrl && <p className="text-red-500">{errors.imageUrl}</p>}
                            {formValues.imageUrl.length > 0 && (
                                <p className="text-green-500">Images selected: {formValues.imageUrl.length}</p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddItem}
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

export default ItemTable;
