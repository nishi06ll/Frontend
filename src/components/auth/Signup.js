import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/signup", {
        username: name,
        email: email,
        password: password,
        password2: passwordConf,
      });
      console.log("Signup successful:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error.response.data);
      setErrorMessage(
        error.response.data.username ||
          error.response.data.password2 ||
          "Registration failed"
      );
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h1 style={styles.heading}>Signup</h1>
          {errorMessage && <div style={styles.error}>{errorMessage}</div>}
          <div style={styles.formGroup}>
            <label style={styles.label}>Name:</label>
            <input
              style={styles.input}
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearErrorMessage(); // Clear error message on input change
              }}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearErrorMessage(); // Clear error message on input change
              }}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearErrorMessage(); // Clear error message on input change
              }}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password:</label>
            <input
              style={styles.input}
              type="password"
              value={passwordConf}
              onChange={(event) => {
                setPasswordConf(event.target.value);
                clearErrorMessage(); // Clear error message on input change
              }}
            />
          </div>
          <button style={styles.submitButton} onClick={handleSignup}>
            Submit
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

export default Register;
