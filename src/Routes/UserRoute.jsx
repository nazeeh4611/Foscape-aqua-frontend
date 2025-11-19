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
import Gallery from "../Components/User/GalleryPage";
import { UserPrivateRoute } from "./Private";
import { PrivacyPolicy, RefundPolicy, ShippingPolicy, TermsConditions } from "../Components/Policy/Privacy";
import FloatingIcons from "../Layout/Icons";
import PortfolioPage from "../Components/User/Works";


function UserRoute() {
  return (
    <>
    <FloatingIcons />

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/:categoryId/sub-category" element={<SubCategoriesPage />} />
      <Route path="/products/subcategory/:subCategoryId" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />

      <Route
        path="/cart"
        element={
          <UserPrivateRoute>
            <CartPage />
          </UserPrivateRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <UserPrivateRoute>
            <WishlistPage />
          </UserPrivateRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <UserPrivateRoute>
            <CheckoutPage />
          </UserPrivateRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <UserPrivateRoute>
            <OrdersPage />
          </UserPrivateRoute>
        }
      />
      <Route
        path="/order-details/:orderId"
        element={
          <UserPrivateRoute>
            <OrderDetailsPage />
          </UserPrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <UserPrivateRoute>
            <ProfilePage />
          </UserPrivateRoute>
        }
      />
      <Route
      path="/order-success/:orderId"
       element={
        <UserPrivateRoute>
       <OrderSuccessPage />
       </UserPrivateRoute>
       } />


      <Route path="/about" element={<AboutPage />} />
      <Route path="/service" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/works" element={<PortfolioPage />} />
    </Routes>
    </>
  );
}

export default UserRoute;

