import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";

function MovieListItem() {
  const [post, setPost] = useState([]);
  const user = useSelector((store) => store.auth.user);
  const fetchPosts = useCallback(() => {
    axios
      .get("http://127.0.0.1:8000/list", {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then((response) => {
        setPost(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.error("Failed to fetch the posts:", error);
      });
  }, [user.token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div>
      <div className="container-lg">
        <div className="row">
          {post.map((item) => (
            <div className="col-md-4" key={item.id}>
              <Link className="movie-link" to={`/blog/posts/${item.id}`}>
                <div className="card mb-3">
                  <img
                    className="card-img-top"
                    src={`http://127.0.0.1:8000${item.poster}`}
                    alt={item.name}
                  />
                </div>
                <div className="card-body">
                  <center>
                    <h3 className="card-title time">{item.time}</h3>
                  </center>
                  <br />
                  <center>
                    <h3 className="card-title name">{item.name}</h3>
                  </center>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieListItem;
