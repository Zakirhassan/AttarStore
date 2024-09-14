import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  products: [],
  loading: false,
  error: null,
};

// Thunks for async operations

// Fetch products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, thunkAPI) => {
  try {
    const response = await axios.get('http://localhost:5500/api/products/list');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.error);
  }
});

// Add product
export const addProduct = createAsyncThunk('products/add', async (productData, thunkAPI) => {
    try {
      const formData = new FormData();
  
      // Append product data
      Object.keys(productData).forEach((key) => {
        if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });
  
      // Append images if they exist
      if (productData.images && productData.images.length) {
        Array.from(productData.images).forEach((image) => {
          formData.append('images', image);
        });
      }
  
      const response = await axios.post('http://localhost:5500/api/products/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.error);
    }
  });
  
  

// Edit product
export const editProduct = createAsyncThunk('products/editProduct', async ({ id, updatedProductData }, thunkAPI) => {
  try {
    const response = await axios.put(`http://localhost:5500/api/products/${id}`, updatedProductData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.error);
  }
});

// Delete product
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, thunkAPI) => {
  try {
    const response = await axios.delete(`http://localhost:5500/api/products/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.error);
  }
});

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action?.payload?.data;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
      })

      // Add product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload); // Add new product to the list
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit product
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products?.filter((product) => product.id !== action.meta.arg); // Remove product from the list
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
