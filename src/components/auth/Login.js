import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const attemptLogin = () => {
    axios
      .post("http://127.0.0.1:8000/login", {
        username: name,
        password: password,
      })
      .then((response) => {
        setErrorMessage("");
        const user = { username: name, token: response.data.token };
        dispatch(setUser(user));
        navigate("/list");
      })
      .catch((error) => {
        if (error.response.data.errors) {
          setErrorMessage(Object.values(error.response.data.errors).join(""));
        } else if (error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Failed to login user. Please contact admin");
        }
      });
  };

  return (
    <div className="login">
      <Navbar />
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h1 style={styles.heading}>Login</h1>
          {errorMessage && <div style={styles.error}>{errorMessage}</div>}
          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              style={styles.input}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button style={styles.submitButton} onClick={attemptLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "91vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    color: "#333",
    fontWeight: "600",
    fontSize: "2rem",
    marginBottom: "1.5rem",
  },
  error: {
    color: "#e74c3c",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
  formGroup: {
    marginBottom: "1.25rem",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "1rem",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },
  submitButton: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#87CEEB",
    color: "black",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default Login;
