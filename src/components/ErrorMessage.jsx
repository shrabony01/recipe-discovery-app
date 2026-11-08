import React from 'react';

/**
 * Reusable alert component for displaying network or data-fetching errors.
 */
export default function ErrorMessage({ message = 'An error occurred while loading content.' }) {
  return (
    <div className="error-banner" role="alert">
      <strong>Notice: </strong>
      <span>{message}</span>
    </div>
  );
}