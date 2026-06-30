import React, { useEffect, useState } from "react";
import "../styling/Nav.css";
import { FaSearch, FaShoppingCart, FaHome, FaInfoCircle, FaShoppingBag, FaPhoneAlt, FaUser } from "react-icons/fa";
import logo from "../assets/logofinal.png";
import slugify from "slugify";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { Link, useLocation } from "react-router-dom";
import { getProducts } from "../services/productService";

function Nav() {
  const location = useLocation();
  const categories = [
    "Clo-Aura",
    "Clo-Prime",
    "Clo-Pixie",
    "Clo-Zion",
    "Clo-Bear",
  ];
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const dispatch = useDispatch();
  const { isAuthenticated, userData } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { totalQuantity } = useSelector((state) => state.cart);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getProducts({});
      if (res) setProducts(res);
      setLoadingProducts(false);
    };
    fetchProducts();
  }, []);

  const handleLogout = () => dispatch(logoutUser());

  const handleSearch = (e) => {
    let query = e.target.value;
    setSearchQuery(query);
    const results = products.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResult(results);
  };

  const closeMobileMenu = () => {
    const navbar = document.getElementById("navbarsExample11");
    if (navbar && navbar.classList.contains("show")) {
      const collapse = window.bootstrap.Collapse.getInstance(navbar);
      if (collapse) collapse.hide();
    }
  };

  return (
    <div className="mynavbar">
      <div className="headline">
        <span>Unique Design • Premium Quality • Unbeatable Prices</span>
      </div>

      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg custom-navbar">
          {/* Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="logo-circle d-flex align-items-center justify-content-center">
              <img src={logo} alt="logo" className="oval-logo" />
            </div>
            <span className="brand-text">CHLOE'S VENTURE</span>
          </Link>

          {/* Mobile Search + Cart + Toggler */}
          <div className="d-flex d-lg-none align-items-center ms-auto">
            <FaSearch
              className="text-dark me-3"
              data-bs-toggle="collapse"
              data-bs-target="#searchCollapse"
            />
            {isAuthenticated && (
              <Link
                to="/user/cart"
                className="text-dark me-3 position-relative"
                onClick={closeMobileMenu}
              >
                <FaShoppingCart size={24} />
                {totalQuantity > 0 && (
                  <span className="cart-badge">{totalQuantity}</span>
                )}
              </Link>
            )}

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarsExample11"
              aria-controls="navbarsExample11"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* Collapsing Menu */}
          <div className="collapse navbar-collapse" id="navbarsExample11">
            <ul className="navbar-nav mx-lg-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/about"
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
              </li>
             

              {/* Shop Dropdown (Desktop) */}
              <li className="nav-item dropdown hover-dropdown d-none d-lg-block">
                <Link className="nav-link" to="/shop">
                  Shop
                </Link>
                <ul className="dropdown-menu show-on-hover">
                  {categories.map((category, i) => {
                    const slug = slugify(category, { lower: true });
                    return (
                      <li key={i}>
                        <Link
                          className="dropdown-item"
                          to={`/shop/${slug}`}
                          onClick={closeMobileMenu}
                        >
                          {category}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* Mobile Shop Dropdown */}
              <li className="nav-item dropdown d-lg-none">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="mobileShopDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Shop
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="mobileShopDropdown"
                >
                  {categories.map((category, i) => {
                    const slug = slugify(category, { lower: true });
                    return (
                      <li key={i}>
                        <Link
                          className="dropdown-item"
                          to={`/shop/${slug}`}
                          onClick={closeMobileMenu}
                        >
                          {category}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/blog" onClick={closeMobileMenu}>
                  Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/contact"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
              </li>
               <Link
                className="nav-link"
                to="/chloes-ai"
                onClick={closeMobileMenu}
              >
                Chloes AI
              </Link>
            </ul>

            {/* Desktop Right Side */}
            <div className="d-none d-lg-flex align-items-center">
            
              <div className="d-flex align-items-center position-relative search-wrapper me-3">
                <FaSearch className="text-dark me-2" />
                <input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="search-input"
                />
                {searchQuery && (
                  <ul className="list-group position-absolute w-100 mt-1 shadow-sm">
                    {loadingProducts ? (
                      <li className="list-group-item text-center">
                        Loading...
                      </li>
                    ) : searchResult.length === 0 ? (
                      <li className="list-group-item text-center text-muted">
                        No results found
                      </li>
                    ) : (
                      searchResult.map((p, i) => (
                        <Link
                          key={i}
                          to={`/${p.category}/${p._id}`}
                          className="list-group-item list-group-item-action"
                          onClick={() => setSearchQuery("")}
                        >
                          {p.title}
                        </Link>
                      ))
                    )}
                  </ul>
                )}
              </div>

              {isAuthenticated && (
                <Link
                  to="/user/cart"
                  className="text-dark me-3 position-relative"
                  onClick={closeMobileMenu}
                >
                  <FaShoppingCart size={28} />
                  {totalQuantity > 0 && (
                    <span className="cart-badge">{totalQuantity}</span>
                  )}
                </Link>
              )}

              {isAuthenticated ? (
                <div className="dropdown">
                  <a className="dropdown-toggle" data-bs-toggle="dropdown">
                    Hi, {userData?.name || "User"}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/user/order">
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/user/wishlist">
                        Wishlist
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/login" className="text-dark">
                  Login / Register
                </Link>
              )}
            </div>

            {/* Mobile User Links */}
            <ul className="navbar-nav d-lg-none mt-3">
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/user/order"
                      onClick={closeMobileMenu}
                    >
                      My Orders
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/user/wishlist"
                      onClick={closeMobileMenu}
                    >
                      Wishlist
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/"
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                    >
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    onClick={closeMobileMenu}
                  >
                    Login / Register
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Collapsible Search for Mobile */}
          <div className="collapse" id="searchCollapse">
            <div className="p-2">
              <input
                type="search"
                className="form-control"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchQuery && (
                <ul className="list-group mt-1 shadow-sm w-100">
                  {loadingProducts ? (
                    <li className="list-group-item text-center">Loading...</li>
                  ) : searchResult.length === 0 ? (
                    <li className="list-group-item text-center text-muted">
                      No results found
                    </li>
                  ) : (
                    searchResult.map((p, i) => (
                      <Link
                        key={i}
                        to={`/${p.category}/${p._id}`}
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          setSearchQuery("");
                          closeMobileMenu();
                        }}
                      >
                        {p.title}
                      </Link>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </nav>
      </div>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav d-flex d-lg-none">
        {[
          { to: "/", icon: <FaHome size={20} />, label: "Home" },
          { to: "/about", icon: <FaInfoCircle size={20} />, label: "About" },
          { to: "/shop", icon: <FaShoppingBag size={20} />, label: "Shop" },
          { to: "/contact", icon: <FaPhoneAlt size={20} />, label: "Contact" },
          { to: isAuthenticated ? "/user/order" : "/login", icon: <FaUser size={20} />, label: isAuthenticated ? "Account" : "Login" },
        ].map(({ to, icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link key={label} to={to} className={`mobile-bottom-nav__tab${isActive ? " active" : ""}`}>
              {icon}
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Nav;
