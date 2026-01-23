import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "./authSlice";


const baseQuery = fetchBaseQuery({
  baseUrl: "https://cheers.com.np/api/v1",
  prepareHeaders: (headers, { getState, endpoint }) => {
    if (endpoint !== "login") {
      const token = getState().auth.token;
      console.log("Sending token:", token);
       if (token) {
      headers.set("Token", token); 
    }
    }
    return headers;
  },
});


export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => {
        const body = new URLSearchParams({
          username: credentials.username,
          password: credentials.password,
          fcm_token: "",
        });
        return {
          url: "/login",
          method: "POST",
          body,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        };
      },
  
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
  try {
    const { data } = await queryFulfilled;
    const token = String(data);
    console.log("Login token:", token);
    dispatch(setCredentials({ token, user: null }));
    localStorage.setItem("token", token);
  } catch (err) {
    console.error("Login failed:", err);
  }
}
}),

    getCategories: builder.query({
      query: () => "/category",
    }),

    getFeaturedProducts: builder.query({
      query: (categoryId) => `/category/featured/${categoryId}`,
    }),

    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity }) => {
        const body = new URLSearchParams();
        body.append(`cart[${productId}]`, quantity);

        return {
          url: `/cart`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Cart"],
    }),

  }),
});

export const {
  useLoginMutation,
  useGetCategoriesQuery,
  useGetFeaturedProductsQuery,
  useGetCartQuery,
  useAddToCartMutation,
} = apiSlice;
