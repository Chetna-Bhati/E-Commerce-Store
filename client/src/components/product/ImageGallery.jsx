import React, { useState } from 'react';
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from '../../utils/imageHelper';

export default function ImageGallery({ images = [], alt = 'Product Image' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeImage = getImageUrl(images[selectedIndex] || images[0]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] shrink-0 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`w-16 h-20 bg-[#EBEBE9] border overflow-hidden shrink-0 transition-all ${
                selectedIndex === idx ? 'border-[#111111] ring-1 ring-[#111111]' : 'border-[#E2E2E0] hover:border-[#6B6B6B]'
              }`}
            >
              <img
                src={getImageUrl(img)}
                alt={`${alt} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = DEFAULT_PRODUCT_IMAGE;
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main 4:5 Portrait Image Preview */}
      <div className="relative flex-1 aspect-[4/5] bg-[#EBEBE9] border border-[#E2E2E0] overflow-hidden">
        <img
          src={activeImage}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-200"
          onError={(e) => {
            e.target.src = DEFAULT_PRODUCT_IMAGE;
          }}
        />
      </div>
    </div>
  );
}
