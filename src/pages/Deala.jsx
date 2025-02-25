import { useState, useContext, useRef, useEffect } from "react";
import Section from "../components/Section";
import Button from "../components/Button";
import axios from "axios";
import Heading from "../components/Heading";
import { ACCESS_TOKEN } from "../constants";
import { service1 } from "../assets";
import withSubscription from "../components/withSubscription";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { ArrowUp } from "lucide-react"

// ... StarRating component remains unchanged ...
const StarRating = ({ rating }) => {
  const numericRating = rating ? parseFloat(rating) : 0;
  const totalStars = 5;
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[...Array(totalStars)].map((_, index) => (
          <Star
            key={index}
            size={24}
            className={`${
              index < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : index === fullStars && hasHalfStar
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'fill-gray-700 text-gray-700'
            } transition-colors`}
          />
        ))}
      </div>
      {numericRating > 0 && (
        <span className="text-gray-300 text-lg font-medium">
          {numericRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// ... DealCard component remains unchanged ...
const DealCard = ({ deal, onViewDeal }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      className="group relative bg-gradient-to-b from-gray-900/40 to-gray-900/60 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-gray-800 hover:border-gray-700 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
    >
      {/* Image Container with Fixed Aspect Ratio */}
      <div className="relative w-full pt-[75%]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900/80 z-10" />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        )}
        <motion.img 
          src={deal.image_url || service1} 
          alt={deal.name}
          onLoad={() => setImageLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transform transition-all duration-700 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${
            imageLoaded ? 'group-hover:scale-110' : ''
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

      {/* Content Container */}
      <div className="relative z-20 p-8 flex flex-col flex-grow">
        <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-4">
          {deal.name}
        </h2>

        <div className="flex-grow">
          <StarRating rating={deal.rating} />
          <p className="text-gray-400 text-sm mt-2">{deal.retailer}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex items-end justify-between mb-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-400 font-medium">Current Price</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white">
                  ${parseFloat(deal.currentPrice).toFixed(2)}
                </span>
                {deal.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${parseFloat(deal.originalPrice).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            {deal.savings?.percentage && (
              <div className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
                {Math.round(parseFloat(deal.savings.percentage))}% OFF
              </div>
            )}
          </div>

          <motion.button
            onClick={() => onViewDeal(deal)}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            whileHover={{ 
              boxShadow: "0 0 20px rgba(66, 153, 225, 0.5)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            View Deal
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { searchResults, setSearchResults } = useContext(SearchContext);
  const textareaRef = useRef(null);

  // Auto-resize function
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Adjust height on value change
  useEffect(() => {
    adjustHeight();
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    adjustHeight();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!query.trim()) {
      setError("Query cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/user-query/",
        { query },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        }
      );

      setSearchResults(data.deals);
    } catch (err) {
      console.error("Error occurred:", err);
      setError(
        err.response?.data?.error ||
          "An error occurred while processing your query."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (deal) => {
    navigate(`/products/${deal.product_id}`, { state: { deal } });
  };

  return (
    <Section 
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-32 md:pt-40 lg:pt-48" 
      id="hero"
    >
      <div className="container relative z-10 mx-auto px-4 mt-8 md:mt-12 lg:mt-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Heading 
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-12" 
            title="Ask Anything, Shop Everything!" 
          />
          
          <form 
            onSubmit={handleSubmit} 
            className="w-full max-w-4xl mx-auto px-4"
          >
          <div className="relative w-full">
            <textarea
                ref={textareaRef}
                placeholder="Search for products..."
                value={query}
                onChange={handleInputChange}
                rows={1}
                className="w-full px-8 py-6 pr-20 text-xl rounded-2xl border border-gray-700 bg-gray-900/50 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none overflow-hidden min-h-[72px]"
              />
              <motion.button
                  type="submit"
                  className="absolute right-6 top-[50%] -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all duration-300 z-10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowUp className="w-6 h-6" />
              </motion.button>
          </div>
            
            {/* <textarea
              ref={textareaRef}
              placeholder="Search for products..."
              value={query}
              onChange={handleInputChange}
              rows={1}
              className="w-full px-6 py-4 text-lg rounded-l-xl border border-gray-700 bg-gray-900/50 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none overflow-hidden min-h-[60px]"
            />
            <motion.button
              type="submit"
              className="px-8 py-4 rounded-r-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Search
            </motion.button> */}
          </form>
          
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"/>
            </motion.div>
          )}
          
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-red-500 text-lg"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {searchResults && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="mt-24 md:mt-32 max-w-[1400px] w-full mx-auto px-6"
          >
            <div className="text-center mb-16">
              <Heading 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent" 
                title="Exclusive Deals Just for You" 
              />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((deal, index) => (
                <DealCard 
                  key={index}
                  deal={deal}
                  onViewDeal={handleProductClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default withSubscription(Hero);
















// import { useState, useContext } from "react";
// import Section from "../components/Section";
// import Button from "../components/Button";
// import axios from "axios";
// import Heading from "../components/Heading";
// import { ACCESS_TOKEN } from "../constants";
// import { service1 } from "../assets";
// import withSubscription from "../components/withSubscription";
// import { useNavigate } from "react-router-dom";
// import { SearchContext } from "../context/SearchContext";
// import { motion, AnimatePresence } from "framer-motion";
// import { Star, ChevronDown, ChevronUp } from "lucide-react";

// const StarRating = ({ rating }) => {
//   const numericRating = rating ? parseFloat(rating) : 0;
//   const totalStars = 5;
//   const fullStars = Math.floor(numericRating);
//   const hasHalfStar = numericRating % 1 >= 0.5;

//   return (
//     <div className="flex items-center gap-2">
//       <div className="flex">
//         {[...Array(totalStars)].map((_, index) => (
//           <Star
//             key={index}
//             size={24}
//             className={`${
//               index < fullStars
//                 ? 'fill-yellow-400 text-yellow-400'
//                 : index === fullStars && hasHalfStar
//                 ? 'fill-yellow-400/50 text-yellow-400'
//                 : 'fill-gray-700 text-gray-700'
//             } transition-colors`}
//           />
//         ))}
//       </div>
//       {numericRating > 0 && (
//         <span className="text-gray-300 text-lg font-medium">
//           {numericRating.toFixed(1)}
//         </span>
//       )}
//     </div>
//   );
// };

// const DealCard = ({ deal, onViewDeal }) => {
//   const [imageLoaded, setImageLoaded] = useState(false);

//   return (
//     <motion.div
//       className="group relative bg-gradient-to-b from-gray-900/40 to-gray-900/60 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-gray-800 hover:border-gray-700 flex flex-col h-full"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -8 }}
//     >
//       {/* Image Container with Fixed Aspect Ratio */}
//       <div className="relative w-full pt-[75%]">
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900/80 z-10" />
//         {!imageLoaded && (
//           <div className="absolute inset-0 bg-gray-800 animate-pulse" />
//         )}
//         <motion.img 
//           src={deal.image_url || service1} 
//           alt={deal.name}
//           onLoad={() => setImageLoaded(true)}
//           className={`absolute inset-0 w-full h-full object-cover transform transition-all duration-700 ease-out ${
//             imageLoaded ? 'opacity-100' : 'opacity-0'
//           } ${
//             imageLoaded ? 'group-hover:scale-110' : ''
//           }`}
//         />
//         {deal.savings?.amount && (
//           <motion.div
//             className="absolute top-6 right-6 z-20 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
//             whileHover={{ scale: 1.05 }}
//           >
//             Save ${parseFloat(deal.savings.amount).toFixed(2)}
//           </motion.div>
//         )}
//       </div>

//       {/* Content Container */}
//       <div className="relative z-20 p-8 flex flex-col flex-grow">
//         {/* Title */}
//         <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-4">
//           {deal.name}
//         </h2>

//         {/* Rating */}
//         <div className="flex-grow">
//           <StarRating rating={deal.rating} />
//           <p className="text-gray-400 text-sm mt-2">{deal.retailer}</p>
//         </div>

//         {/* Price and CTA Section */}
//         <div className="mt-6 pt-4 border-t border-gray-800">
//           <div className="flex items-end justify-between mb-6">
//             <div className="space-y-1">
//               <p className="text-sm text-gray-400 font-medium">Current Price</p>
//               <div className="flex items-baseline gap-3">
//                 <span className="text-4xl font-bold text-white">
//                   ${parseFloat(deal.currentPrice).toFixed(2)}
//                 </span>
//                 {deal.originalPrice && (
//                   <span className="text-lg text-gray-500 line-through">
//                     ${parseFloat(deal.originalPrice).toFixed(2)}
//                   </span>
//                 )}
//               </div>
//             </div>
//             {deal.savings?.percentage && (
//               <div className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
//                 {Math.round(parseFloat(deal.savings.percentage))}% OFF
//               </div>
//             )}
//           </div>

//           <motion.button
//             onClick={() => onViewDeal(deal)}
//             className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
//             whileHover={{ 
//               boxShadow: "0 0 20px rgba(66, 153, 225, 0.5)",
//             }}
//             whileTap={{ scale: 0.98 }}
//           >
//             View Deal
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const Hero = () => {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { searchResults, setSearchResults } = useContext(SearchContext);

//   const handleInputChange = (e) => {
//     setQuery(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");

//     if (!query.trim()) {
//       setError("Query cannot be empty.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const { data } = await axios.post(
//         "http://127.0.0.1:8000/api/user-query/",
//         { query },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
//           },
//         }
//       );

//       setSearchResults(data.deals);
//     } catch (err) {
//       console.error("Error occurred:", err);
//       setError(
//         err.response?.data?.error ||
//           "An error occurred while processing your query."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProductClick = (deal) => {
//     navigate(`/products/${deal.product_id}`, { state: { deal } });
//   };

//   return (
//     <Section 
//       className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-32 md:pt-40 lg:pt-48" 
//       id="hero"
//     >
//       {/* Search Section */}
//       <div className="container relative z-10 mx-auto px-4 mt-8 md:mt-12 lg:mt-16">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center"
//         >
//           <Heading 
//             className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-12" 
//             title="Ask Anything, Shop Everything!" 
//           />
          
//           <form 
//             onSubmit={handleSubmit} 
//             className="flex items-center max-w-2xl mx-auto"
//           >
//             <input
//               type="text"
//               placeholder="Search for products..."
//               value={query}
//               onChange={handleInputChange}
//               className="w-full px-6 py-4 text-lg rounded-l-xl border border-gray-700 bg-gray-900/50 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
//             />
//             <motion.button
//               type="submit"
//               className="px-8 py-4 rounded-r-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               Search
//             </motion.button>
//           </form>
          
//           {loading && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="mt-8"
//             >
//               <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"/>
//             </motion.div>
//           )}
          
//           {error && (
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="mt-6 text-red-500 text-lg"
//             >
//               {error}
//             </motion.p>
//           )}
//         </motion.div>
//       </div>

//       {/* Results Section */}
//       <AnimatePresence>
//         {searchResults && searchResults.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             transition={{ duration: 0.6 }}
//             className="mt-24 md:mt-32 max-w-[1400px] w-full mx-auto px-6"
//           >
//             <div className="text-center mb-16">
//               <Heading 
//                 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent" 
//                 title="Exclusive Deals Just for You" 
//               />
//             </div>

//             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//               {searchResults.map((deal, index) => (
//                 <DealCard 
//                   key={index}
//                   deal={deal}
//                   onViewDeal={handleProductClick}
//                 />
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </Section>
//   );
// };

// export default withSubscription(Hero);


