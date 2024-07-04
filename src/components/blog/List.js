import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Listposts() {
  const user = useSelector((store) => store.auth.user);
  const [posts, setPosts] = useState([]);

  const fetchPosts = useCallback(() => {
    if (user) {
      axios
        .get("http://127.0.0.1:8000/list", {
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
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="list">
      <Navbar />
      <style>
        {`
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          .card {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          }
          .card img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: 10px 10px 0 0;
            transition: opacity 0.3s;
          }
          .card:hover img {
            opacity: 0.8;
          }
          .card-body {
            padding: 20px;
            text-align: center;
          }
          .card-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
          }
          .card-title.time {
            color: #6c757d;
          }
          .card-title.name {
            color: skyblue; 
          }
          .list h1 {
            font-size: 2.5rem;
            color: skyblue;
            margin-bottom: 20px;
            text-align: center;
          }
          .list h3 {
            font-style: italic;
            color: #6c757d;
            text-align: center;
          }
        `}
      </style>
      <div className="container mt-4">
        <h1>MOVIE LIST</h1>
        <div className="row justify-content-center">
          {posts.length === 0 ? (
            <div className="col-md-12">
              <h3>NO MOVIE POSTER FOUND...</h3>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="col-md-3 mb-4">
                <Link
                  to={`/blog/posts/${post.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="card">
                    <img
                      className="card-img-top"
                      src={`http://127.0.0.1:8000${post.poster}`}
                      alt={post.name}
                    />
                    <div className="card-body">
                      <h3 className="card-title time">{post.time}</h3>
                      <h3 className="card-title name">{post.name}</h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Listposts;
