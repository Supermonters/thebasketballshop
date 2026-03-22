import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Outlet } from "react-router-dom";
import { AboutPage } from "./pages/AboutPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminProductPage } from "./pages/AdminProductPage";
import { CartPage } from "./pages/CartPage";
import { HomePage } from "./pages/HomePage";
import { NewsPage } from "./pages/NewsPage";
import { ProductPage } from "./pages/ProductPage";
import { StorePage } from "./pages/StorePage";
import { TrendsPage } from "./pages/TrendsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/xuhuong" element={<TrendsPage />} />
      </Route>
      <Route element={<Outlet />}>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/product" element={<AdminProductPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
