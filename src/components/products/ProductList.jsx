import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Slider from "react-slick";
import {
  useGetFeaturedProductsQuery,
  useAddToCartMutation,
} from "../../redux/api/apiSlice.js";
import { selectCurrentToken } from "../../redux/api/authSlice.js";
import css from "./ProductList.module.css";

const ProductList = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef(null);

  const categoryId = 84667;
  const { data, error, isLoading } = useGetFeaturedProductsQuery(categoryId);
  const [addToCart] = useAddToCartMutation();

  const token = useSelector(selectCurrentToken);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const productsData = data?.data || data || [];
  const allCategories = Array.isArray(productsData)
    ? productsData
    : Object.values(productsData);

  const categories = allCategories
    .map((category) => {
      const filteredProducts = category.products?.filter((product) =>
        product.name.toLowerCase().includes(searchQuery),
      );
      return { ...category, products: filteredProducts };
    })
    .filter((category) => category.products && category.products.length > 0);

  const sliderSettings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 700,
    slidesToShow: 4.25,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const showToastMessage = (message, duration = 3000) => {
    setToastMessage(message);
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), duration);
  };

  const handleAddToCart = async (product) => {
    if (!token) {
      showToastMessage("Please log in to add items to your cart.", 3000);
      return;
    }

    try {
      const res = await addToCart({
        productId: product.id,
        quantity: 1,
      }).unwrap();

      showToastMessage(`${product.name} → ${res.message}`);
    } catch (err) {
      console.error("Failed to add to cart", err);
      let message = "Failed to add item to cart.";
      if (err.status === 401 || err.status === 403) {
        message = "Please log in to add items to your cart.";
      }
      showToastMessage(message);
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

          {category.products && category.products.length > 0 ? (
            <Slider {...sliderSettings}>
              {category.products.map((product) => (
                <div
                  key={product.id}
                  className="p-2"
                  id={category.category_name.toLowerCase().replaceAll(" ", "-")}
                >
                  <div className="card h-100 shadow-sm">
                    <img
                      src={product.image}
                      className={`${css.cardImg} card-img-top p-3`}
                      alt={product.name}
                      style={{ cursor: "pointer" }}
                    />

                    <div className="card-body d-flex flex-column">
                      <h5
                        className={` ${css.cardTitle} card-title text-truncate`}
                        title={product.name}
                      >
                        {product.name}
                      </h5>

                      {product.price && (
                        <p
                          className={` ${css.cardPrice} card-text fw-bold text-black`}
                        >
                          Rs. {product.price}
                        </p>
                      )}

                      <div className="mt-auto">
                        <button
                          className={`${css.cartBtn} btn btn-primary`}
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
            </Slider>
          ) : (
            <p>No products available.</p>
          )}
        </div>
      ))}

      {/* Toast */}
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
            <strong className="me-auto">Message</strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowToast(false)}
              aria-label="Close"
            />
          </div>
          <div className="toast-body">{toastMessage}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
