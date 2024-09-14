import React, { useState, useCallback, useEffect } from "react";
import {
  Box, Button, TextField, Typography, Select, MenuItem, InputLabel, FormControl, Modal, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { Delete as DeleteIcon, ZoomIn as ZoomInIcon, Close as CloseIcon } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, fetchProducts, deleteProduct, editProduct } from "../app/features/auth/productSlice"; // Adjust the path as needed

const AddProductForm = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const [productData, setProductData] = useState({
    name: "",
    size: "",
    unit: "",
    description: "",
    inrPrice: "",
    euroPrice: "",
    category: "",
    reviews: "",
  });
  const [images, setImages] = useState([]);
  const [isFormValid, setIsFormValid] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const onDrop = useCallback((acceptedFiles) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleImageDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleImageClick = (image) => {
    setViewImage(image);
  };

  const handleSubmit = async () => {
    if (!productData.name || !productData.size || !productData.unit || !productData.description || !productData.inrPrice || !productData.euroPrice || !productData.category || !productData.reviews) {
      setIsFormValid(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("size", productData.size);
    formData.append("unit", productData.unit);
    formData.append("description", productData.description);
    formData.append("inrPrice", productData.inrPrice);
    formData.append("euroPrice", productData.euroPrice);
    formData.append("category", productData.category);
    formData.append("reviews", productData.reviews);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await dispatch(addProduct({ ...productData, images })).unwrap(); // Dispatch addProduct action
      setImages([]); // Clear images after successful addition
      setProductData({
        name: "",
        size: "",
        unit: "",
        description: "",
        inrPrice: "",
        euroPrice: "",
        category: "",
        reviews: "",
      });
      dispatch(fetchProducts());
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (product) => {
    setProductData({
      name: product.name,
      size: product.size,
      unit: product.unit,
      description: product.description,
      inrPrice: product.inrPrice,
      euroPrice: product.euroPrice,
      category: product.category,
      reviews: product.reviews,
    });
    setImages(product.images.map((image) => `http://localhost:5500${image}`)); // Use the full image URL

    setEditProductId(product.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  console.log("iiiiiiii", images)

  const handleDelete = async (productId) => {
    try {
      await dispatch(deleteProduct(productId)).unwrap(); // Dispatch deleteProduct action
      dispatch(fetchProducts()); // Fetch products after deletion
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products && products?.filter((product) =>
    product?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>Products</Typography>
        <Button variant="contained" color="primary" onClick={() => {
          setIsModalOpen(true);
          setIsEditMode(false);
        }}>
          Add Product
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search Products"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>INR Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.inrPrice}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(product)}>Edit</Button>
                  <Button onClick={() => handleDelete(product.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{
          width: "50%", maxHeight: "80vh", overflowY: "auto", margin: "auto", mt: 5, bgcolor: "white", p: 3
        }}>
          <Typography variant="h5" gutterBottom>{isEditMode ? 'Edit Product' : 'Add Product'}</Typography>

          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            margin="normal"
            error={!productData.name && !isFormValid}
            helperText={!productData.name && !isFormValid ? "Required" : ""}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Size"
              name="size"
              value={productData.size}
              onChange={handleInputChange}
              margin="normal"
              error={!productData.size && !isFormValid}
              helperText={!productData.size && !isFormValid ? "Required" : ""}
            />
            <FormControl fullWidth margin="normal" error={!productData.unit && !isFormValid}>
              <InputLabel>Unit</InputLabel>
              <Select name="unit" value={productData.unit} onChange={handleInputChange}>
                <MenuItem value="ml">ml</MenuItem>
                <MenuItem value="Liter">Liter</MenuItem>
              </Select>
              {!productData.unit && !isFormValid && <Typography color="error">Required</Typography>}
            </FormControl>
          </Box>

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            margin="normal"
            error={!productData.description && !isFormValid}
            helperText={!productData.description && !isFormValid ? "Required" : ""}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="INR Price"
              name="inrPrice"
              type="number"
              value={productData.inrPrice}
              onChange={handleInputChange}
              margin="normal"
              error={!productData.inrPrice && !isFormValid}
              helperText={!productData.inrPrice && !isFormValid ? "Required" : ""}
            />
            <TextField
              fullWidth
              label="Euro Price"
              name="euroPrice"
              type="number"
              value={productData.euroPrice}
              onChange={handleInputChange}
              margin="normal"
              error={!productData.euroPrice && !isFormValid}
              helperText={!productData.euroPrice && !isFormValid ? "Required" : ""}
            />
          </Box>

          <TextField
            fullWidth
            label="Category"
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            margin="normal"
            error={!productData.category && !isFormValid}
            helperText={!productData.category && !isFormValid ? "Required" : ""}
          />
          <TextField
            fullWidth
            label="Reviews"
            name="reviews"
            value={productData.reviews}
            onChange={handleInputChange}
            margin="normal"
            error={!productData.reviews && !isFormValid}
            helperText={!productData.reviews && !isFormValid ? "Required" : ""}
          />

          {/* Drag and Drop Image Upload Area */}
          <Box {...getRootProps()} sx={{
            border: '2px dashed #ccc', borderRadius: '8px', p: 2, textAlign: 'center', cursor: 'pointer', mt: 2
          }}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <Typography>Drop the files here...</Typography>
            ) : (
              <Typography>Drag and drop some files here, or click to select files</Typography>
            )}
          </Box>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
  {images.map((image, index) => (
    <Box key={index} sx={{ position: 'relative' }}>
      {typeof image === 'string' ? (
        // If the image is a URL (existing image)
        <img
          src={image}
          alt={`Product Image ${index}`}
          style={{ width: 100, height: 100, cursor: 'pointer' }}
          onClick={() => handleImageClick(image)}
        />
      ) : (
        // If the image is a File (newly uploaded)
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          style={{ width: 100, height: 100, cursor: 'pointer' }}
          onClick={() => handleImageClick(image)}
        />
      )}
      <IconButton
        size="small"
        sx={{ position: 'absolute', top: 0, right: 0 }}
        onClick={() => handleImageDelete(index)}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  ))}
</Box>


          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
            {isEditMode ? 'Update Product' : 'Add Product'}
          </Button>

          {viewImage && (
            <Modal open={!!viewImage} onClose={() => setViewImage(null)}>
              <Box sx={{
                width: '80%', height: '80%', margin: 'auto', mt: 5, bgcolor: 'white', p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'
              }}>
                <img src={URL.createObjectURL(viewImage)} alt="Full view" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                <IconButton
                  size="large"
                  sx={{ position: 'absolute', top: 10, right: 10 }}
                  onClick={() => setViewImage(null)}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Modal>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default AddProductForm;
