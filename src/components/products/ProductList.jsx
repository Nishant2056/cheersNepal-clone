import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetFeaturedProductsQuery,
  useAddToCartMutation,
} from "../../redux/api/apiSlice.js";
import { selectCurrentToken } from "../../redux/api/authSlice.js";

const ProductList = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef(null);
  const categoryId = 84667;
  const { data, error, isLoading } = useGetFeaturedProductsQuery(categoryId);
  const [addToCart] = useAddToCartMutation();
  const token = useSelector(selectCurrentToken);
  const navigate = useNavigate();

  const productsData = data?.data || data || [];
  const categories = Array.isArray(productsData)
    ? productsData
    : Object.values(productsData);

  const handleAddToCart = async (product) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
      setToastMessage(`${product.name} added to cart!`);
      setShowToast(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Failed to add to cart", err);
      let message = "Failed to add item to cart.";
      if (err.status === 401 || err.status === 403) {
        message = "Please log in to add items to your cart.";
      }
      setToastMessage(message);
      setShowToast(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (isLoading) return <div className="container mt-5">Loading...</div>;
  if (error)
    return <div className="container mt-5">Error loading products</div>;

  return (
    <div className="container mt-5">
      {categories.map((category) => (
        <div key={category.category_id} className="mb-5">
          <h3 className="mb-4 border-bottom pb-2">{category.category_name}</h3>
          <div className="row">
            {category.products &&
              category.products.map((product) => (
                <div key={product.id} className="col-md-3 mb-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={product.image}
                      className="card-img-top p-3"
                      alt={product.name}
                      style={{ height: "200px", objectFit: "contain" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5
                        className="card-title text-truncate"
                        title={product.name}
                      >
                        {product.name}
                      </h5>
                      {product.price && (
                        <p className="card-text fw-bold text-primary">
                          Rs. {product.price}
                        </p>
                      )}
                      <div className="mt-auto">
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.status === "out-of-stock"}
                        >
                          Add to Cart
                        </button>
                        <p
                          className={`small mt-2 ${
                            product.status === "out-of-stock"
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {product.status === "out-of-stock"
                            ? "Out of Stock"
                            : "Available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 999 }}
      >
        <div
          className={`toast ${showToast ? "show" : ""}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Success</strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowToast(false)}
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">{toastMessage}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
