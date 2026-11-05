import { useState } from "react";
import "./Search.css";

function Search({ onSearch }) {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchInput.trim());
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    if (!value.trim()) onSearch("");
  };

  return (
    <form className="catalog-search" role="search" onSubmit={handleSubmit}>
      <svg
        className="catalog-search-icon"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 5 5" />
      </svg>
      <input
        id="catalog-search-input"
        className="catalog-search-input"
        type="search"
        aria-label="Buscar productos"
        placeholder="Buscar productos..."
        value={searchInput}
        onChange={handleChange}
      />
      <button className="catalog-search-button" type="submit">
        Buscar
      </button>
    </form>
  );
}

export default Search;
