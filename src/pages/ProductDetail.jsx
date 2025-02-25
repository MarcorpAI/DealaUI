import React, { useState } from 'react';
import { Star, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductDescription from '../components/ProductDescription';

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const deal = location.state?.deal;

  if (!deal) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 group transition-colors"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Search Results
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-b from-gray-900/40 to-gray-900/60 backdrop-blur-xl rounded-[2rem] border border-gray-800 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 p-8">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900/80 z-10" />
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                )}
                <motion.img
                  src={deal.image_url}
                  alt={deal.name}
                  onLoad={() => setImageLoaded(true)}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {deal.savings?.amount && (
                  <motion.div
                    className="absolute top-6 right-6 z-20 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    Save ${parseFloat(deal.savings.amount).toFixed(2)}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:w-1/2 p-8 lg:p-12 bg-gray-900/50">
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-4">
                    {deal.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    {deal.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              size={24}
                              className={`${
                                index < Math.floor(deal.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : index === Math.floor(deal.rating) && deal.rating % 1 >= 0.5
                                  ? 'fill-yellow-400/50 text-yellow-400'
                                  : 'fill-gray-700 text-gray-700'
                              } transition-colors`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-300 text-lg font-medium">
                          {parseFloat(deal.rating).toFixed(1)}
                        </span>
                      </div>
                    )}
                    {deal.retailer && (
                      <span className="text-gray-400">{deal.retailer}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-5xl font-bold text-white">
                    ${parseFloat(deal.currentPrice).toFixed(2)}
                  </div>
                  {deal.originalPrice && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 line-through text-xl">
                        ${parseFloat(deal.originalPrice).toFixed(2)}
                      </span>
                      {deal.savings?.percentage && (
                        <span className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-bold">
                          {Math.round(parseFloat(deal.savings.percentage))}% OFF
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {deal.description && (
                  <p className="text-gray-300 leading-relaxed">
                     <ProductDescription description={deal.description} />
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                  {deal.condition && (
                    <div className="text-gray-300">
                      <span className="text-gray-500">Condition: </span>
                      {deal.condition}
                    </div>
                  )}
                  {deal.shipping_info && (
                    <div className="text-gray-300">
                      <span className="text-gray-500">Shipping: </span>
                      {deal.shipping_info}
                    </div>
                  )}
                  {deal.return_policy && (
                    <div className="text-gray-300">
                      <span className="text-gray-500">Returns: </span>
                      {deal.return_policy}
                    </div>
                  )}
                  {deal.location && (
                    <div className="text-gray-300">
                      <span className="text-gray-500">Location: </span>
                      {deal.location}
                    </div>
                  )}
                </div>

                <motion.a
                  href={deal.productLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg text-center transition-all duration-300"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(66, 153, 225, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  View on {deal.retailer}
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;