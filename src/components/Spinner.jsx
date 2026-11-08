import React from 'react';

/**
 * Reusable loading spinner component with customizable text.
 */
export default function Spinner({ message = 'Loading delicious recipes...' }) {
  return (
    <div className="flex-center">
      <div className="loader" role="status" aria-label="Loading"></div>
      <p style={{ marginTop: '1rem', color: '#6c757d', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
}