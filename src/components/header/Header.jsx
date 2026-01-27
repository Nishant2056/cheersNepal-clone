import css from "./Header.module.css";
import Logo from "../../assets/cheers-logo.svg";
import Buy from "../../assets/Buy.svg";
import {
  useGetCategoriesQuery,
  useGetCartQuery,
} from "../../redux/api/apiSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { logOut, selectCurrentToken } from "../../redux/api/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoMdLogOut } from "react-icons/io";

const Header = () => {
  const { data, error, isLoading } = useGetCategoriesQuery();
  const stores = Array.isArray(data) ? data : data?.data || [];
  const token = useSelector(selectCurrentToken);
  useGetCartQuery(undefined, { skip: !token });
  const cartItems = useSelector((state) => state.cart?.items || []);
  const cartItemCounter = cartItems.reduce(
    (acc, item) => acc + (Number(item.quantity) || 1),
    0,
  );

  // if (isLoading) return <div className="container mt-5">Loading...</div>;
  // if (error)
  //   return <div className="container mt-5">Error loading categories</div>;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchParams((prev) => {
      if (query) prev.set("search", query);
      else prev.delete("search");
      return prev;
    });
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      dispatch(logOut());
    }
  };

  return (
    <div className={`${css.mainHeader}`}>
      <div className={css.topBar}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <span className="me-4">
                <strong>Order by Phone:</strong>{" "}
                <a href="tel:015365008" className="text-white">
                  01-5365008
                </a>
              </span>

              <span>
                <strong>Delivery Hours:</strong> 10:38 AM to 09:30 PM (NST)
              </span>
            </div>

            <div className="col-md-4 text-end">
              <span className="me-3">Cash or Card on Delivery</span>

              <button className="currency-selector">
                <i className="fas fa-exchange-alt currency-icon"></i> Currency:
                NPR <i className="fas fa-caret-down ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${css.mainMenu} main-nav bg-light`}>
        <div className="container d-flex">
          <div className="col-2">
            <a href="/">
              <img src={Logo} className="img-fluid" alt="Logo" />
            </a>
          </div>
          <div className="col-4 d-flex align-items-center">
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li>
                <a href="#" className="nav-link px-2 fw-bold text-black">
                  Near Expiry
                </a>
              </li>

              <li>
                <a href="#" className="nav-link px-2 fw-bold text-black">
                  Try Ons
                </a>
              </li>

              <li>
                <a
                  href="/bulk-items"
                  className="nav-link px-2 fw-bold text-black"
                >
                  Bulk Items
                </a>
              </li>
            </ul>
          </div>
          <div className="col-4 d-flex align-items-center">
            <div className={` ${css.searchBox} d-flex p-2 rounded w-100`}>
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  All Categories
                </button>

                <ul className={`${css.categoryList} dropdown-menu`}>
                  {stores.map((store) => (
                    <div key={store.id} className="mb-5">
                      <h3 className="mb-4 border-bottom pb-2 text-center">
                        {store.store_name}
                      </h3>

                      {store.category &&
                        Object.values(store.category).map((cat) => (
                          <li
                            key={cat.id}
                            className={` ${css.categoryListItem} mb-2 list-unstyled p-2`}
                          >
                            <a
                              href="#"
                              className="text-decoration-none text-black fw-semibold d-flex align-items-center"
                            >
                              <img
                                src={cat.icon}
                                alt=""
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  objectFit: "contain",
                                  marginRight: "5px",
                                }}
                              />
                              {cat.name}
                            </a>
                          </li>
                        ))}
                    </div>
                  ))}
                </ul>
              </div>

              <input
                type="text"
                placeholder="Search in..."
                value={searchParams.get("search") || ""}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="col-2 d-flex align-items-center justify-content-end">
            <div className="position-relative">
              <img
                src={Buy}
                alt="Cart"
                role="button"
                onClick={() => navigate("/cart")}
              />
              {cartItemCounter >= 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemCounter}
                </span>
              )}
            </div>
          </div>
          {token && (
            <div className="col-1 text-end d-flex align-items-center justify-content-center">
              <button
                type="button"
                className="btn btn-success d-flex align-items-center justify-content-center"
                onClick={handleLogout}
              >
                {" "}
                <IoMdLogOut />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
