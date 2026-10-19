import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from '../../utils/imageHelper';

export default function CartItemRow({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex gap-4 py-4 border-b border-[#E2E2E0] last:border-b-0 bg-[#FFFFFF] p-3 rounded">
      {/* 4:5 Aspect Ratio Thumbnail */}
      <Link to={`/products/${item.slug}`} className="w-20 sm:w-24 aspect-[4/5] bg-[#EBEBE9] shrink-0 border border-[#E2E2E0] overflow-hidden">
        <img
          src={getImageUrl(item.imageUrl)}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = DEFAULT_PRODUCT_IMAGE;
          }}
        />
      </Link>

      {/* Item Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link to={`/products/${item.slug}`}>
              <h4 className="font-heading text-sm text-[#111111] hover:text-[#F97316] transition-colors line-clamp-1">
                {item.name}
              </h4>
            </Link>
            <button
              onClick={() => onRemove(item.id)}
              className="text-[#6B6B6B] hover:text-red-600 transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Size & Color Snapshot */}
          <p className="text-xs text-[#6B6B6B] mt-1">
            Size: <strong className="text-[#111111]">{item.size}</strong> • Color: <strong className="text-[#111111]">{item.color}</strong>
          </p>

          {/* Out of Stock warning */}
          {!item.inStock && (
            <p className="text-xs text-red-600 font-bold mt-1">
              Low inventory: Only {item.availableStock} remaining
            </p>
          )}
        </div>

        {/* Quantity Stepper & Price Row */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#E2E2E0]">
          {/* Stepper */}
          <div className="flex items-center border border-[#E2E2E0] bg-[#F5F4F2]">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-1.5 hover:bg-[#FFFFFF] disabled:opacity-30 text-[#111111] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-[#111111]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= 10 || item.quantity >= item.availableStock}
              className="p-1.5 hover:bg-[#FFFFFF] disabled:opacity-30 text-[#111111] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="font-heading text-sm font-extrabold text-[#111111]">
              {formatPrice(item.price * item.quantity)}
            </span>
            {item.mrp > item.price && (
              <p className="text-[11px] text-[#6B6B6B] line-through">
                {formatPrice(item.mrp * item.quantity)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
