import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';

export default function App() {
  return (
    // Wrap entire application tree in FavoritesProvider for universal access
    <FavoritesProvider>
      <BrowserRouter>
        <div className="app-shell">
          {/* Global Navbar persistent across all pages */}
          <Navbar />

          <main className="main-content">
            <Routes>
              {/* Static / Landing route */}
              <Route path="/" element={<HomePage />} />

              {/* Dynamic route: browse meals by category */}
              <Route path="/category/:categoryName" element={<CategoryPage />} />

              {/* Dynamic route: single recipe details */}
              <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />

              {/* Search results with query parameters */}
              <Route path="/search" element={<SearchPage />} />

              {/* Saved recipes list */}
              <Route path="/favorites" element={<FavoritesPage />} />

              {/* 404 Not Found fallback route */}
              <Route
                path="*"
                element={
                  <div className="page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    <h2>404 - Page Not Found</h2>
                    <p style={{ color: '#6c757d', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                      The page you are looking for does not exist.
                    </p>
                    <Link to="/" className="btn-primary">
                      Return Home
                    </Link>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  );
}