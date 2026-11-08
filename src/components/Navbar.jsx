import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

/**
 * Global navigation header featuring brand logo, search bar, and favorites counter.
 */
export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  // Handles search form submission and navigates with URL query params
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/search?query=${encodeURIComponent(trimmed)}`);
      setSearchTerm(''); // Clear input after submission
    }
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand Link */}
        <Link to="/" className="brand-logo">
          🍽️ RecipeFinder
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-form" role="search">
          <input
            type="text"
            placeholder="Search recipes (e.g., Arrabiata, Pie)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search recipes"
            required
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link to="/">Categories</Link>
          <Link to="/favorites" className="favorites-link">
            Favorites <span className="counter-badge">{favorites.length}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}