import { useGetCategoriesQuery } from "../../redux/api/apiSlice.js";
import css from "./Categories.module.css";

const Categories = () => {
  const { data, error, isLoading } = useGetCategoriesQuery();

  const stores = Array.isArray(data) ? data : data?.data || [];

  if (isLoading) return <div className="container mt-5">Loading...</div>;
  if (error)
    return <div className="container mt-5">Error loading categories</div>;

  return (
    <div className="container mt-5">
      {stores.map((store) => (
        <div key={store.id} className="mb-5">
          <h3 className="mb-4 border-bottom pb-2">{store.store_name}</h3>
          <div className="row">
            {store.category &&
              Object.values(store.category).map((cat) => (
                <div key={cat.id} className="col-6 col-md-3 col-lg-2 mb-4">
                  <div className="card h-100 text-center p-3 shadow-sm">
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className={` ${css.categoryIcon} card-img-top mx-auto mb-2`}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "contain",
                        transition: "transform 0.3s ease-in-out",
                      }}
                    />

                    <div className="card-body p-0">
                      <h6 className="card-title mb-0">{cat.name}</h6>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;
