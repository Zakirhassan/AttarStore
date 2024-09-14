import { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import AddProductForm from "../pages/AddProductForm";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("addProduct");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Left sidebar with two buttons for Dashboard and Add Product */}
      <Box
        sx={{
          width: 200,
          p: 2,
          borderRight: "1px solid #ddd", // adds a divider between the sidebar and content
        }}
      >
        {/* <Button
          fullWidth
          variant={activeTab === "dashboard" ? "contained" : "outlined"}
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => handleTabChange("dashboard")}
        >
          Dashboard
        </Button> */}
        <Button
          fullWidth
          variant={activeTab === "addProduct" ? "contained" : "outlined"}
          color="primary"
          onClick={() => handleTabChange("addProduct")}
        >
          Product
        </Button>
      </Box>

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {activeTab === "dashboard" && (
          <Box>
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography>Welcome to the admin dashboard!</Typography>
            {/* You can add more dashboard-related content here */}
          </Box>
        )}

        {activeTab === "addProduct" && (
         <AddProductForm />
        )}
      </Box>
    </Box>
  );
};

export default AdminPanel;
