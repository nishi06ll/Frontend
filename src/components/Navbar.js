import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../store/authSlice";

function Navbar() {
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function Logout() {
    if (user && user.token) {
      axios
        .post(
          "http://127.0.0.1:8000/api/logout/",
          {},
          {
            headers: { Authorization: " Token " + user.token },
          }
        )
        .then(() => {
          dispatch(removeUser());
          navigate("/login");
        })
        .catch((error) => {
          console.log("Logout error");
        });
    }
  }

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-info">
      <div className="navbar-brand">
        <h4>🅱0️⃣0️⃣ 🅺 🅼🆈 🆃🅸🅲🅺🅴🆃 🎟️</h4>
      </div>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse mr-auto" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink to="/" className="nav-link signup-link">
              SIGNUP
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/list" className="nav-link movie-list-link">
              MOVIE LIST
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/Pre" className="nav-link my-bookings-link">
              MYBOOKINGS
            </NavLink>
          </li>
          {user ? (
            <li className="nav-item">
              <NavLink className="nav-link logout-link" onClick={Logout}>
                LOGOUT
              </NavLink>
            </li>
          ) : (
            <li className="nav-item">
              <button className="login-button">
                <NavLink
                  to="/login"
                  className="nav-link login-link"
                  style={{ color: "black" }}
                >
                  LOGIN
                </NavLink>
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
