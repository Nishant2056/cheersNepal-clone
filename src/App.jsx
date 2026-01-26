import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import LoginPage from "./pages/Login";
import CartPage from "./pages/Cart";
import DashboardPage from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
