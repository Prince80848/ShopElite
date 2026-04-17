import { apiSlice } from './apiSlice';

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({ url: '/orders', method: 'POST', body: data }),
      invalidatesTags: ['Order'],
    }),
    getMyOrders: builder.query({
      query: () => '/orders/mine',
      providesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
    }),
    createPaymentOrder: builder.mutation({
      query: (data) => ({ url: '/payment/create-order', method: 'POST', body: data }),
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({ url: '/payment/verify', method: 'POST', body: data }),
      invalidatesTags: ['Order'],
    }),
    getAdminStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['AdminStats'],
    }),
    getAllOrders: builder.query({
      query: (params) => ({ url: '/admin/orders', params }),
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/admin/orders/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Order', 'AdminStats'],
    }),
    getAllUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['User'],
    }),
    toggleUserRole: builder.mutation({
      query: (id) => ({ url: `/admin/users/${id}/role`, method: 'PUT' }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
  useGetAdminStatsQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetAllUsersQuery,
  useToggleUserRoleMutation,
} = ordersApi;
