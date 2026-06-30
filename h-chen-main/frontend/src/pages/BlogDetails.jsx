import React, { useEffect, useState } from "react";
import { getPost } from "../services/sanityServices";
import { useParams } from "react-router-dom";
import "../styling/blog/BlogDetails.css";

function BlogDetails() {
  const slug = useParams().slug;
  const [blog, setBlog] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await getPost(slug);
      setBlog(response);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="d-flex flex-column justify-content-end text-white blog-hero-banner"
        style={{
          backgroundImage: `url(${blog?.coverImage?.asset?.url})`,
        }}
      >
        <div className="d-flex justify-content-between align-items-end w-100">
          <div>
            <h5 className="text-uppercase">{blog?.tag}</h5>
            <h1 className="fw-bold display-3" style={{ maxWidth: "80%" }}>
              {blog?.title}
            </h1>
          </div>
          <p className="text-light">{new Date(blog?.date).toDateString()}</p>
        </div>
      </div>

      {/* Blog Content */}
      {blog?.content && (
        <div className="my-5 blog-content">
          {blog?.content.map((block) => {
            if (block._type === "block") {
              if (block.style === "h4") {
                return (
                  <h4 key={block._key} className="fw-semibold mt-5 mb-3 h3">
                    {block.children.map((child) => child.text).join("")}
                  </h4>
                );
              }
              if (block.listItem === "bullet") {
                return (
                  <ul key={block._key} className="ms-4 mb-3">
                    <li>
                      {block.children.map((child) => child.text).join("")}
                    </li>
                  </ul>
                );
              }
              return (
                <p key={block._key} className="fs-5 mb-4">
                  {block.children.map((child) => child.text).join("")}
                </p>
              );
            }

            if (block._type === "image") {
              return (
                <img
                  key={block._key}
                  src={block.asset.url}
                  alt=""
                  className="img-fluid rounded my-4"
                />
              );
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
}

export default BlogDetails;
