import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const TicketBooking = () => {
  const user = useSelector((store) => store.auth.user);
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const yourDate = searchParams.get("date");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const ticketOptions = Array.from({ length: 100 }, (_, i) =>
    (i + 1).toLocaleString()
  );

  const toggleTicketSelection = (ticketNumber) => {
    setSelectedTickets((prev) => {
      if (prev.includes(ticketNumber)) {
        return prev.filter((t) => t !== ticketNumber);
      } else {
        return [...prev, ticketNumber];
      }
    });
  };

  const sendConfirmationEmail = async (booking_id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/email/${postId}/`,
        { user_email: user.email },
        { headers: { Authorization: `Token ${user.token}` } }
      );
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }
  };

  const handleBookTicket = async () => {
    setIsBooking(true);
    setResponseMessage(null);
    setErrorMessage(null);
    try {
      const totalTickets = selectedTickets.length;
      if (totalTickets === 0) {
        throw new Error("Please select at least one ticket.");
      }
      const response = await axios.post(
        `http://127.0.0.1:8000/start-payment/${postId}/`,
        { tickets: totalTickets, date: yourDate },
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      );

      const { booking_id, razorpay_order_id, amount } = response.data;
      const options = {
        key: "rzp_test_UAvD5zvepb6QBR",
        amount: amount * 100,
        currency: "INR",
        order_id: razorpay_order_id,
        name: "Ticket Booking",
        description: "Book movie tickets",
        handler: async (paymentResponse) => {
          const { razorpay_payment_id } = paymentResponse;
          await axios.post(
            "http://127.0.0.1:8000/handle-payment-success/",
            { razorpay_order_id, razorpay_payment_id },
            { headers: { Authorization: `Token ${user.token}` } }
          );

          await sendConfirmationEmail(booking_id);
          setResponseMessage("Booking Successful");
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          error.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="ticket-booking">
      <div className="booking-container" style={styles.container}>
        <h2 style={styles.heading}>Book Your Tickets</h2>
        <div className="ticket-options" style={styles.ticketOptions}>
          {ticketOptions.map((option) => (
            <button
              key={option}
              onClick={() => toggleTicketSelection(option)}
              style={{
                ...styles.ticket,
                backgroundColor: selectedTickets.includes(option)
                  ? "#87CEEB" // Sky blue when selected
                  : "#f0f0f0",
                color: selectedTickets.includes(option) ? "#ffffff" : "#000000",
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="payment-button" style={styles.paymentButtonContainer}>
          <button
            onClick={handleBookTicket}
            style={{
              ...styles.payButton,
              backgroundColor: isBooking ? "#ccc" : "#87CEEB", // Sky blue color
              cursor: isBooking ? "not-allowed" : "pointer",
            }}
            disabled={isBooking}
          >
            {isBooking ? "Booking in Progress..." : "Book Tickets"}
          </button>
        </div>
        {responseMessage && (
          <div className="success-message" style={styles.responseMessage}>
            {responseMessage}
          </div>
        )}
        {errorMessage && (
          <div className="error-message" style={styles.errorMessage}>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    margin: "0 auto",
    maxWidth: 600,
    padding: 20,
    borderRadius: 5,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
  },
  heading: {
    textAlign: "center",
    color: "black",
    marginBottom: 20,
  },
  ticketOptions: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  ticket: {
    margin: 5,
    padding: "10px 15px",
    border: "2px solid #87CEEB",
    borderRadius: 5,
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  paymentButtonContainer: {
    marginTop: 20,
    textAlign: "center",
  },
  payButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: 5,
    backgroundColor: "#87CEEB", // Sky blue color
    color: "black",
    fontSize: 16,
    cursor: "pointer",
    transition: "background-color 0.3s ease, opacity 0.3s ease",
  },
  responseMessage: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 18,
    color: "#4CAF50",
  },
  errorMessage: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 18,
    color: "#f44336",
  },
};

export default TicketBooking;
