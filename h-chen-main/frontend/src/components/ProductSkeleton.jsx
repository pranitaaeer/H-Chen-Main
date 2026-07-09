import React from "react";

function ProductSkeleton() {
  return (
    <div className="col-md-3 mb-4">
      <div className="card border-0 shadow-sm">
        <div
          className="placeholder-glow"
          style={{
            height: "280px",
            background: "#e9ecef",
            borderRadius: "8px",
          }}
        ></div>

        <div className="card-body">
          <p className="placeholder-glow">
            <span className="placeholder col-8"></span>
          </p>

          <p className="placeholder-glow">
            <span className="placeholder col-4"></span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductSkeleton;