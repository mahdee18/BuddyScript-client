import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';


const Avatar = ({ src, alt = 'User avatar', className = 'w-10 h-10' }) => {
  const [imageError, setImageError] = useState(false);

  // If the provided `src` fails to load, this component will re-render to show the placeholder.
  const handleImageError = () => {
    setImageError(true);
  };

  // Render the image if a src is provided and it hasn't failed to load.
  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover ${className}`}
        onError={handleImageError}
      />
    );
  }

  // Render the default placeholder icon if no src or if the image failed.
  return (
    <div
      className={`rounded-full bg-gray-200 text-gray-500 flex items-center justify-center ${className}`}
      aria-label={alt}
    >
      <FaUser size="60%" />
    </div>
  );
};

export default Avatar;