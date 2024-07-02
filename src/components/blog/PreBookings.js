import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";

function Listposts() {
  const user = useSelector((store) => store.auth.user);
  const [posts, setPosts] = useState([]);

  const fetchPostsAndGeneratePDF = useCallback(() => {
    if (user) {
      axios
        .get("http://127.0.0.1:8000/my-bookings", {
          headers: { Authorization: "Token " + user.token },
        })
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch posts:", error);
        });
    }
  }, [user]);

  useEffect(() => {
    fetchPostsAndGeneratePDF();
  }, [fetchPostsAndGeneratePDF]);

  const downloadBooking = (pk) => {
    if (user) {
      axios
        .get(`http://127.0.0.1:8000/product/pdf/${pk}/`, {
          headers: { Authorization: `Token ${user.token}` },
          responseType: "blob",
        })
        .then((response) => {
          const url = window.URL.createObjectURL(
            new Blob([response.data], { type: "application/pdf" })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `booking_${pk}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((err) => {
          console.error("Failed to download booking:", err);
        });
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card border rounded p-4 shadow-sm">
              <h2 className="text-center mb-4">My Bookings</h2>
              <div className="row">
                {posts.map((post) => (
                  <div key={post.id} className="col-md-4 mb-4">
                    <div className="card bg-light h-100">
                      <div className="card-body">
                        <p className="card-text">
                          Booking Date: {post.booking_date}
                        </p>
                        <p className="card-text">Tickets: {post.tickets}</p>
                        <p className="card-text">
                          Order ID: {post.razorpay_order_id}
                        </p>
                      </div>
                      <div className="card-footer text-center">
                        <button
                          className="btn btn-info"
                          onClick={() => downloadBooking(post.id)}
                        >
                          Download PDF & QR
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Listposts;

const styles = {
  container: {
    backgroundColor: "#f0f0f0",
    padding: "20px",
    minHeight: "100vh",
  },
};
