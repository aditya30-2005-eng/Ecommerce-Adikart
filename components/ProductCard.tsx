// Reduced image height and padding for a more compact card
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 
                    border border-slate-100 dark:border-slate-800 
                    transform hover:scale-[1.01]">
      <div className="relative">
        {/* Reduced image height */}
        <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.name} />
        <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">{product.category}</div>
      </div>
      {/* Reduced padding */}
      <div className="p-4 flex flex-col flex-grow"> 
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-50 mb-1 truncate group-hover:text-indigo-500 transition-colors">{product.name}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-xs flex-grow mb-3 leading-normal line-clamp-3">{product.description}</p>
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">₹{product.price.toLocaleString('en-IN')}</p>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`
              text-white px-4 py-2 rounded-lg font-bold text-sm transition-all transform active:scale-95 shadow-md 
              ${isOutOfStock 
                ? 'bg-red-500 cursor-not-allowed opacity-60' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/40'
              }
            `}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;