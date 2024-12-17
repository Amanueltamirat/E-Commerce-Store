import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products/create-product", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch all products", loading: false });
			console.log(error.response)
			// toast.error(error.response.data.error || "Failed to fetch all products");
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products by category", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products by category");
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/delete-product/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			console.log(response)
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>{
				return 	product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
			}),
				loading: false,
			}
			));
		} catch (error) {
			set({ loading: false });
			console.log(error)
			toast.error(error.response.data.error || "Failed to update product");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/feature-product");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch featured products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
    
}
));