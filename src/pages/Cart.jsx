import {
  useGetCartQuery,
  useAddToCartMutation,
} from "../redux/api/apiSlice.js";
import { selectCurrentToken } from "../redux/api/authSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/api/cartSlice";
import css from "./Cart.module.css";

const CartPage = () => {
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetCartQuery(undefined, {
    skip: !token,
  });
  const [addToCart] = useAddToCartMutation();

  console.log("the data are:", data);
  const items = useSelector((state) => state.cart.items);

  if (isLoading) return <div className="container mt-5">Loading cart...</div>;
  if (error) return <div className="container mt-5">Error loading cart</div>;

  const totalAmount = items.reduce(
    (acc, item) => acc + Number(item.price) * (Number(item.quantity) || 1),
    0,
  );

  return (
    <div className={`${css.cartStatus} container mt-5`}>
      <h2 className="mb-4">Shopping Cart</h2>
      {!items || items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={`https://cheers.com.np/uploads/products/${item.image}`}
                    alt={item.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                      marginRight: "15px",
                    }}
                  />
                  <div>
                    <h5>{item.name}</h5>
                    {item.price && (
                      <p className="mb-0">Unit Price: रु {item.price}</p>
                    )}
                    <div className="d-flex align-items-center mt-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          if (item.quantity > 1) {
                            dispatch(decreaseQuantity(item.id));
                            addToCart({
                              productId: item.id,
                              quantity: Number(item.quantity) - 1,
                            });
                          }
                        }}
                      >
                        -
                      </button>
                      <span className="mx-3">{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          dispatch(increaseQuantity(item.id));
                          addToCart({
                            productId: item.id,
                            quantity: Number(item.quantity) + 1,
                          });
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <p className="mb-2 fw-bold">
                    Total: रु{" "}
                    {Number(item.price) * (Number(item.quantity) || 1)}
                  </p>
                  <button
                    className="btn btn-danger"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-end align-items-center">
            <h4 className="me-3 mb-0">Grand Total: रु {totalAmount}</h4>
            <button type="button" className="btn btn-success">
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
