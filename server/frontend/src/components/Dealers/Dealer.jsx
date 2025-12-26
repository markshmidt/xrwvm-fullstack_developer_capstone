import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import "./Dealers.css";
import "../assets/style.css";

import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";

const Dealer = () => {
  const { id } = useParams();

  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingDealer, setLoadingDealer] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const baseUrl = window.location.origin;

  const dealerUrl = `${baseUrl}/djangoapp/dealer/${id}/`;
  const reviewsUrl = `${baseUrl}/djangoapp/reviews/dealer/${id}/`;

  // ------------------------
  // Fetch dealer info
  // ------------------------
  const fetchDealer = async () => {
    try {
      const res = await fetch(dealerUrl);
      const data = await res.json();

      if (data.status === 200) {
        if (Array.isArray(data.dealer)) {
          setDealer(data.dealer[0]);
        } else {
          setDealer(data.dealer);
        }
      }
    } catch (err) {
      console.error("Failed to load dealer:", err);
    } finally {
      setLoadingDealer(false);
    }
  };

  // ------------------------
  // Fetch reviews
  // ------------------------
  const fetchReviews = async () => {
    try {
      const res = await fetch(reviewsUrl);
      const data = await res.json();

      if (data.status === 200) {
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchDealer();
    fetchReviews();
  }, [id]);

  // ------------------------
  // Sentiment icon helper
  // ------------------------
  const sentimentIcon = (sentiment) => {
    if (sentiment === "positive") return positive_icon;
    if (sentiment === "negative") return negative_icon;
    return neutral_icon;
  };

  // ------------------------
  // Loading state
  // ------------------------
  if (loadingDealer) {
    return (
      <div style={{ margin: "20px" }}>
        <Header />
        <h3>Loading dealer information...</h3>
      </div>
    );
  }

  // ------------------------
  // Safety check
  // ------------------------
  if (!dealer) {
    return (
      <div style={{ margin: "20px" }}>
        <Header />
        <h3>Dealer not found</h3>
      </div>
    );
  }

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  return (
    <div style={{ margin: "20px" }}>
      <Header />

      {/* Dealer info */}
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name}
          {isLoggedIn && (
            <a href={`/postreview/${id}`}>
              <img
                src={review_icon}
                alt="Post Review"
                style={{ width: "10%", marginLeft: "10px" }}
              />
            </a>
          )}
        </h1>

        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip {dealer.zip}, {dealer.state}
        </h4>
      </div>

      {/* Reviews */}
      <div className="reviews_panel">
        {loadingReviews ? (
          <div>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, index) => (
            <div className="review_panel" key={index}>
              <img
                src={sentimentIcon(review.sentiment)}
                className="emotion_icon"
                alt="Sentiment"
              />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} — {review.car_make} {review.car_model}{" "}
                {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
