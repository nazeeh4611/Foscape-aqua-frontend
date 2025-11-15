import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../Components/User/HomePage";
import SubCategoriesPage from "../Components/User/SubCategoryPage";
import CategoriesPage from "../Components/User/CategoryPage";
import ProductsPage from "../Components/User/ProductPage";
import ProductDetailsPage from "../Components/User/DetailsPage";
import { CartPage, WishlistPage } from "../Components/User/CartPage";
import AboutPage from "../Components/User/AboutPage";
import ServicesPage from "../Components/User/ServicePage";
import ContactPage from "../Components/User/Contact";
import { OrderSuccessPage } from "../Components/User/OrderSuccess";
import { OrdersPage } from "../Components/User/Orders";
import { OrderDetailsPage } from "../Components/User/OrderDetails";
import { CheckoutPage } from "../Components/User/CheckoutPage";
import { ProfilePage } from "../Components/User/ProfilePage";

function UserRoute() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/:categoryId/sub-category" element={<SubCategoriesPage />} />
      <Route path="/products/subcategory/:subCategoryId" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />   
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage/>} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/order-details/:orderId" element={<OrderDetailsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/about" element={<AboutPage/>} />
      <Route path="/service" element={<ServicesPage/>} />
      <Route path="/contact" element={<ContactPage/>} />
    </Routes>
  );
}

export default UserRoute;