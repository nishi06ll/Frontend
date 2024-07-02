import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";

function MovieDetailsWithBooking() {
  const user = useSelector((store) => store.auth.user);
  const { postId } = useParams();
  const [post, setPost] = useState({
    name: "",
    time: "",
    ticket_amount: "",
    description: "",
  });
  const [selectedDate, setSelectedDate] = useState("2024-05-13");

  useEffect(() => {
    console.log("postId:", postId);
    if (user && user.token) {
      axios
        .get(`http://127.0.0.1:8000/view/${postId}/`, {
          headers: { Authorization: `Token ${user.token}` },
        })
        .then((response) => {
          setPost(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch movie details:", error);
        });
    }
  }, [postId, user]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="movie-details-page">
      <Navbar />
      <div className="container justify-content-center">
        <div className="row">
          <div className="col-lg-8 offset-lg-2 col-md-10 offset-md-1">
            <div className="card" style={styles.card}>
              <div className="card-header">
                <h3 style={styles.cardTitle}>MOVIE NAME: {post.name}</h3>
              </div>
              <div className="card-body">
                <div style={styles.movieInfo}>
                  <p style={styles.info}>MOVIE TIME: {post.time}</p>
                  <p style={styles.info}>TICKET AMOUNT: {post.ticket_amount}</p>
                  <p style={styles.info}>MOVIE DETAILS: {post.description}</p>
                </div>
                <div className="select-date-section">
                  <label style={styles.selectDateLabel}>SELECT DATE:</label>
                  <select
                    className="form-control"
                    style={styles.selectDate}
                    value={selectedDate}
                    onChange={handleDateChange}
                  >
                    <option value="2024-05-16">July 03, 2024</option>
                    <option value="2024-05-17">July 04, 2024</option>
                    <option value="2024-05-18">July 05, 2024</option>
                    <option value="2024-05-19">July 06, 2024</option>
                    <option value="2024-05-20">July 07, 2024</option>
                  </select>
                </div>
                <Link
                  to={`/blog/post/${postId}?date=${selectedDate}`}
                  className="btn btn-info"
                  style={styles.btnBooking}
                >
                  BOOKING
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsWithBooking;

const styles = {
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
  cardTitle: {
    fontSize: "1.8rem",
    color: "#343a40",
  },
  movieInfo: {
    marginBottom: "20px",
  },
  info: {
    fontSize: "1.2rem",
    color: "#6c757d",
    marginBottom: "10px",
  },
  selectDateLabel: {
    fontSize: "1.2rem",
    color: "#343a40",
    marginRight: "10px",
  },
  selectDate: {
    width: "200px",
    fontSize: "1rem",
    color: "#495057",
  },
  btnBooking: {
    marginTop: "20px",
  },
};
