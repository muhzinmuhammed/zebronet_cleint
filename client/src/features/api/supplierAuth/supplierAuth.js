import { api } from "../api";

const supplierAuth = api.injectEndpoints({
    endpoints: (builder) => ({
        addSupplier: builder.mutation({
            query: (values) => ({
                url: '/v1/supplier/add_supplier',
                method: 'POST',
                body: values,
            }),
        }),
      
        allSupplier: builder.query({
            query: () => ({
                url: '/v1/supplier/all_supplier',
                method: 'GET',
            }),
        }),
    }),
});

// Correctly exporting the hooks generated by `injectEndpoints`
export const { useAddSupplierMutation, useAllSupplierQuery } = supplierAuth;
