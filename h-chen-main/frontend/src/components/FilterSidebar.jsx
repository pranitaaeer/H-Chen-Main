import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styling/FilterSidebar.css";

function FilterSidebar({ filters, handleFilterChange, resetFilters }) {
  const location = useLocation();
  const showCategories = location.pathname === "/shop";

  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    "clo-zion",
    "clo-prime",
    "clo-aura",
    "clo-pixie",
    "clo-bear",
  ];

  // ✅ lowercase values, but display with proper case in labels
  const colors = [
    "gray",
    "navy",
    "black",
    "beige",
    "blue",
    "white",
    "yellow",
    "purple",
  ];

  const minRange = 100;
  const maxRange = 5000;

  const rangeTrackRef = useRef(null);

  const updateTrackFill = () => {
    const track = rangeTrackRef.current;
    if (!track) return;

    const minPercent =
      ((filters.price.min - minRange) / (maxRange - minRange)) * 100;
    const maxPercent =
      ((filters.price.max - minRange) / (maxRange - minRange)) * 100;

    track.style.background = `linear-gradient(to right, 
      #ccc ${minPercent}%, 
      black ${minPercent}%, 
      black ${maxPercent}%, 
      #ccc ${maxPercent}%)`;
  };

  useEffect(() => {
    updateTrackFill();
  }, [filters.price]);

  const handlePriceChange = (type, value) => {
    const newVal = parseInt(value, 10);
    if (type === "min" && newVal <= filters.price.max) {
      handleFilterChange({
        target: { name: "price", value: { ...filters.price, min: newVal } },
      });
    } else if (type === "max" && newVal >= filters.price.min) {
      handleFilterChange({
        target: { name: "price", value: { ...filters.price, max: newVal } },
      });
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const updatedCategories = checked
      ? [...filters.category, value]
      : filters.category.filter((item) => item !== value);

    handleFilterChange({
      target: { name: "category", value: updatedCategories },
    });
  };

  // ✅ Normalize colors to lowercase
  const handleColorChange = (e) => {
    const { value, checked } = e.target;
    const colorValue = value.toLowerCase();
    const updatedColors = checked
      ? [...filters.color, colorValue]
      : filters.color.filter((c) => c !== colorValue);

    handleFilterChange({
      target: { name: "color", value: updatedColors },
    });
  };

  return (
    <div className="filter-sidebar-wrapper">
      <button
        className="filter-toggle-btn d-md-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖ Hide Filters " : "☰ Filter & Sort "}
      </button>

      <div className={`filter-sidebar ${isOpen ? "open" : ""}`}>
        <h6 className="section-title">BROWSE BY</h6>

        {showCategories && (
          <div className="filter-group">
            <label className="filter-subtitle">CATEGORIES</label>
            {categories.map((c) => (
              <div className="form-check checkbox-list" key={c}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={c}
                  checked={filters.category.includes(c)}
                  onChange={handleCategoryChange}
                />
                <label className="form-check-label">{c}</label>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Color Filter */}
        <div className="filter-group">
          <label className="filter-subtitle">COLOR</label>
          {colors.map((color) => (
            <div className="form-check checkbox-list" key={color}>
              <input
                className="form-check-input"
                type="checkbox"
                name="color"
                value={color}
                checked={filters.color.includes(color)}
                onChange={handleColorChange}
              />
              {/* Show capitalized label */}
              <label className="form-check-label">
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </label>
            </div>
          ))}
        </div>

        {/* Price Filter */}
        <div className="filter-group">
          <label className="filter-subtitle">PRICE RANGE</label>
          <div className="range-slider-wrapper">
            <div className="tooltip-container">
              <span className="tooltip">{filters.price.min}</span>
              <span className="tooltip">{filters.price.max}</span>
            </div>
            <div className="range-slider-container">
              <input
                type="range"
                min={minRange}
                max={maxRange}
                value={filters.price.min}
                onChange={(e) => handlePriceChange("min", e.target.value)}
              />
              <input
                type="range"
                min={minRange}
                max={maxRange}
                value={filters.price.max}
                onChange={(e) => handlePriceChange("max", e.target.value)}
              />
              <div className="range-slider-track" ref={rangeTrackRef}></div>
            </div>
          </div>

          <div className="price-labels d-flex justify-content-between mt-2">
            <span>₹{filters.price.min}</span>
            <span>₹{filters.price.max}</span>
          </div>
        </div>

        <div className="filter-group mt-3">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;
