import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../Components/User/HomePage";
import SubCategoriesPage from "../Components/User/SubCategoryPage";
import CategoriesPage from "../Components/User/CategoryPage";
import ProductsPage from "../Components/User/ProductPage";
import ProductDetailsPage from "../Components/User/DetailsPage";

function UserRoute() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/:categoryId/sub-category" element={<SubCategoriesPage />} />
        <Route path="/products/subcategory/:subCategoryId" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />   
           </Routes>
    </>
  );
}

export default UserRoute;
