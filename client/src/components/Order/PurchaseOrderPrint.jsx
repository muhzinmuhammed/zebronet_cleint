import React, { forwardRef } from 'react';

const PurchaseOrderPrint = forwardRef(({ order }, ref) => (
   <>
    <div ref={ref} className="p-6 bg-white text-black">
        <h2 className="text-2xl font-semibold text-center mb-4">Purchase Order</h2>
        <div className="mb-2">
            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
            <p><strong>Item:</strong> {order.itemId?.itemName}</p>
            <p><strong>Supplier:</strong> {order.supplierId?.supplierName}</p>
            <p><strong>Quantity:</strong> {order.qty}</p>
            <p><strong>Price:</strong> ${order.price}</p>
            <p><strong>Total Price:</strong> ${order.totalPrice}</p>
        </div>
    </div>
   </>
));

export default PurchaseOrderPrint;
