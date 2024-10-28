import { useState } from "react";
import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  Tag,
  Percent,
  DollarSign,
  Clock,
  ExternalLink,
  Search,
} from "lucide-react";
import Section from "../components/Section";
import Button from "../components/Button";
import Heading from "../components/Heading";
import ButtonGradient from "../assets/svg/ButtonGradient";
import { ACCESS_TOKEN } from "../constants";
import withSubscription from "../components/withSubscription";

const Hero = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [expandedDeals, setExpandedDeals] = useState({});

  const toggleDealExpansion = (dealIndex) => {
    setExpandedDeals((prev) => ({
      ...prev,
      [dealIndex]: !prev[dealIndex],
    }));
  };

  const parseAIResponse = (response) => {
    // First, get the response text from the appropriate property
    const responseText =
      response.ai_response ||
      response.aiResponse ||
      response.data ||
      response.text;

    if (!responseText || typeof responseText !== "string") {
      console.error("Invalid response format:", response);
      return [];
    }

    // Split the response into sections based on numbered items
    const dealSections = responseText
      .split(/(?=\d+\.\s+\*\*)/g)
      .filter(Boolean);

    return dealSections
      .map((section) => {
        // Helper function to extract value after a label
        const extractValue = (text, label, multiline = false) => {
          const regex = multiline
            ? new RegExp(`${label}:[\\s\\S]*?((?=\\d+\\.|$|\\*\\*))`)
            : new RegExp(`${label}:\\s*([^\\n]+)`);
          const match = text.match(regex);
          return match
            ? multiline
              ? match[0].split(":\n").slice(1).join("\n").trim()
              : match[1].trim()
            : null;
        };

        // Extract basic deal information
        const nameMatch = section.match(/\*\*([^*]+)\*\*/);
        const name = nameMatch ? nameMatch[1].trim() : null;

        // Extract prices
        const currentPrice = extractValue(section, "Current Price")?.replace(
          /[^0-9.]/g,
          ""
        );
        const originalPrice = extractValue(section, "Original Price")?.replace(
          /[^0-9.]/g,
          ""
        );

        // Extract description and URLs
        const description = extractValue(section, "Description");
        const productLink = extractValue(section, "Product URL");
        const expiration = extractValue(section, "Expiration");

        // Extract coupons
        const couponSection =
          section.match(/Available Coupons:([\s\S]*?)(?=\n\s*[A-Z]|$)/)?.[1] ||
          "";
        const coupons = Array.from(
          couponSection.matchAll(/\* Code:\s*(.*?)\s*-\s*(.*?)(?=\n|$)/g)
        ).map((match) => ({
          code: match[1].trim(),
          description: match[2].trim(),
        }));

        // Extract cashback offers
        const cashbackSection =
          section.match(/Cashback Offers:([\s\S]*?)(?=\n\s*[A-Z]|$)/)?.[1] ||
          "";
        const cashback = Array.from(
          cashbackSection.matchAll(/\*\s*(.*?):\s*(.*?)(?=\n|$)/g)
        ).map((match) => ({
          platform: match[1].trim(),
          amount: match[2].trim(),
        }));

        // Extract steps
        const stepsSection =
          section.match(
            /How to Get This Deal\*\*:([\s\S]*?)(?=\n\s*\d+\.|$)/
          )?.[1] || "";
        const steps = stepsSection
          .split(/\d+\.\s+/)
          .filter(Boolean)
          .map((step) => step.trim());

        // Return the structured deal object
        return {
          name,
          currentPrice,
          originalPrice,
          description,
          productLink,
          coupons: coupons.filter((c) => c.code && c.description),
          cashback: cashback.filter((c) => c.platform && c.amount),
          steps: steps.filter(Boolean),
          expiration,
        };
      })
      .filter((deal) => deal.name); // Filter out any deals without names
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setError("");

    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        "https://mysite-sdvw.onrender.com/api/user-query/",
        { query },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        }
      );

      // Parse the AI response from the data
      const deals = parseAIResponse(data);

      if (deals.length === 0) {
        setError("No deals found. Please try a different search.");
      } else {
        setResponse({ deals });
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred while searching for deals. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = (deal) => {
    const original = parseFloat(deal.originalPrice || "0");
    const current = parseFloat(deal.currentPrice || "0");

    if (original && current && original > current) {
      const savings = original - current;
      const percentage = (savings / original) * 100;
      return {
        amount: savings.toFixed(2),
        percentage: percentage.toFixed(1),
      };
    }
    return null;
  };

  const handleDealClick = (link) => {
    if (!link) {
      setError("No link available for this deal.");
      return;
    }

    try {
      const cleanUrl = link.trim().replace(/\s+/g, "");
      // Only open if it's a valid URL
      if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
        window.open(cleanUrl, "_blank", "noopener,noreferrer");
      } else {
        setError("Invalid URL format for this deal.");
      }
    } catch {
      setError("Invalid URL format for this deal.");
    }
  };

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem] flex flex-col justify-center items-center min-h-screen"
      id="hero"
    >
      {/* Header */}
      <div className="container relative z-2 text-center">
        <Heading
          className="md:max-w-md lg:max-w-2xl mx-auto"
          title="Shop smarter. Save bigger. Experience the future of deal hunting."
        />
      </div>

      {/* Search Form */}
      <div className="mt-8 w-full max-w-3xl flex items-center space-x-4 px-4">
        <form
          className="flex-grow flex items-center bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-full p-2"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for products, deals, or discounts..."
            className="flex-grow bg-transparent border-none outline-none text-white px-4 py-2"
          />
          <Button
            type="submit"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Search size={20} />
            <span>Search</span>
          </Button>
        </form>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="mt-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {error && (
        <div className="mt-8 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Deals Display */}
      {response?.deals && response.deals.length > 0 && (
        <div className="mt-8 w-full max-w-7xl px-4">
          <div className="container relative z-2 text-center mb-8">
            <Heading
              className="md:max-w-md lg:max-w-2xl mx-auto"
              title={`Found ${response.deals.length} Deal${
                response.deals.length > 1 ? "s" : ""
              }`}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {response.deals.map((deal, index) => {
              const savings = calculateSavings(deal);
              const isExpanded = expandedDeals[index];

              return (
                <div
                  key={index}
                  className="card bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
                >
                  <div className="p-6">
                    {/* Deal Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-white">
                        {deal.name}
                      </h2>
                      <div className="flex flex-col items-end">
                        {deal.originalPrice && (
                          <div className="text-sm text-gray-400 line-through">
                            ${deal.originalPrice}
                          </div>
                        )}
                        <div className="text-2xl font-bold text-white">
                          ${deal.currentPrice}
                        </div>
                      </div>
                    </div>

                    {/* Savings Badge */}
                    {savings && (
                      <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full inline-flex items-center gap-2 mb-4">
                        <DollarSign size={16} />
                        <span>
                          Save ${savings.amount} ({savings.percentage}% off)
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {deal.description && (
                      <p className="text-gray-300 mb-4">{deal.description}</p>
                    )}

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleDealExpansion(index)}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp size={20} />
                          <span>Show less</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={20} />
                          <span>Show more details</span>
                        </>
                      )}
                    </button>

                    {/* Extended Info */}
                    {isExpanded && (
                      <div className="space-y-4 mt-4 border-t border-gray-700 pt-4">
                        {/* Coupons Section */}
                        {deal.coupons && deal.coupons.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                              <Tag size={18} />
                              Available Coupons
                            </h3>
                            <div className="space-y-2">
                              {deal.coupons.map((coupon, idx) => (
                                <div
                                  key={idx}
                                  className="bg-gray-800/50 p-3 rounded-lg"
                                >
                                  <div className="font-mono text-green-400">
                                    {coupon.code}
                                  </div>
                                  <div className="text-sm text-gray-300">
                                    {coupon.description}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Cashback Section */}
                        {deal.cashback && deal.cashback.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                              <Percent size={18} />
                              Cashback Offers
                            </h3>
                            <div className="space-y-2">
                              {deal.cashback.map((offer, idx) => (
                                <div
                                  key={idx}
                                  className="bg-gray-800/50 p-3 rounded-lg"
                                >
                                  <div className="font-semibold text-white">
                                    {offer.platform}
                                  </div>
                                  <div className="text-green-400">
                                    {offer.amount}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Steps Section */}
                        {deal.steps && deal.steps.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-white">
                              How to Get This Deal
                            </h3>
                            <ol className="list-decimal list-inside space-y-1 text-gray-300">
                              {deal.steps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Expiration */}
                        {deal.expiration && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock size={16} />
                            <span>Expires: {deal.expiration}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-6">
                      <Button
                        onClick={() => handleDealClick(deal.productLink)}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <ExternalLink size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ButtonGradient />
    </Section>
  );
};

export default withSubscription(Hero);

// import { useState } from "react";
// import axios from "axios";
// import {
//   ChevronDown,
//   ChevronUp,
//   Tag,
//   Percent,
//   DollarSign,
//   Clock,
//   ExternalLink,
//   Search,
// } from "lucide-react";
// import Section from "../components/Section";
// import Button from "../components/Button";
// import Heading from "../components/Heading";
// import ButtonGradient from "../assets/svg/ButtonGradient";
// import { ACCESS_TOKEN } from "../constants";
// import withSubscription from "../components/withSubscription";
// // import { Alert } from "@/components/ui/alert";

// const Hero = () => {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState("");
//   const [expandedDeals, setExpandedDeals] = useState({});

//   const toggleDealExpansion = (dealIndex) => {
//     setExpandedDeals((prev) => ({
//       ...prev,
//       [dealIndex]: !prev[dealIndex],
//     }));
//   };

//   const parseAIResponse = (response) => {
//     // **Step 1: Log and Verify the Response Type**
//     console.log("**Response Received:**");
//     console.log(typeof response); // Expected output: "object"
//     console.log(response); // Inspect the response object

//     // **Step 2: Extract the Response Text**
//     let responseText;
//     if (response.aiResponse) {
//       responseText = response.aiResponse;
//       console.log("**Using aiResponse property:**");
//     } else if (response.data) {
//       responseText = response.data;
//       console.log("**Using data property:**");
//     } else if (response.text) {
//       responseText = response.text;
//       console.log("**Using text property:**");
//     } else {
//       console.error("**Error:** Unable to find response text property.");
//       return []; // or throw an error, depending on your requirements
//     }

//     // **Step 3: Verify the Response Text Type**
//     console.log("**Response Text Type:**");
//     console.log(typeof responseText); // Expected output: "string"
//     console.log(responseText); // Inspect the response text

//     if (typeof responseText !== "string") {
//       console.error(
//         "**Error:** Invalid responseText type:",
//         typeof responseText
//       );
//       return []; // or throw an error, depending on your requirements
//     }

//     // **Step 4: Split the Response Text into Deal Sections**
//     const dealSections = responseText.split(
//       /(?=\d+\.\s+\*\*Product Name\*\*)/g
//     );
//     console.log("**Deal Sections:**");
//     console.log(dealSections); // Inspect the deal sections

//     // **Step 5: Parse Each Deal Section**
//     const deals = dealSections
//       .map((section) => {
//         // Helper function to extract value after a label
//         const extractValue = (text, label) => {
//           const match = text.match(new RegExp(`${label}:\\s*([^\\n]+)`));
//           return match ? match[1].trim() : null;
//         };

//         // Extract basic information
//         const name = extractValue(section, "\\*\\*Product Name\\*\\*");
//         const currentPrice = extractValue(section, "Current Price");
//         const originalPrice = extractValue(section, "Original Price");
//         const description = extractValue(section, "Description");
//         const productLink = extractValue(section, "Product URL");
//         const expiration = extractValue(section, "Expiration");

//         // Extract coupons
//         const coupons = [];
//         const couponSection =
//           section.match(/Available Coupons:([\s\S]*?)(?=\n\s*[A-Z]|$)/)?.[1] ||
//           "";
//         const couponMatches = couponSection.matchAll(
//           /\* Code:\s*(.*?)\s*-\s*Description:\s*(.*?)(?=\n|$)/g
//         );
//         for (const match of Array.from(couponMatches)) {
//           coupons.push({
//             code: match[1].trim(),
//             description: match[2].trim(),
//           });
//         }

//         // Extract cashback offers
//         const cashback = [];
//         const cashbackSection =
//           section.match(/Cashback Offers:([\s\S]*?)(?=\n\s*[A-Z]|$)/)?.[1] ||
//           "";
//         const cashbackMatches = cashbackSection.matchAll(
//           /\* Platform:\s*(.*?)\s*-\s*(.*?)(?=\n|$)/g
//         );
//         for (const match of Array.from(cashbackMatches)) {
//           cashback.push({
//             platform: match[1].trim(),
//             amount: match[2].trim(),
//           });
//         }

//         // Extract steps
//         const stepsSection =
//           section.match(
//             /How to Get This Deal\*\*:([\s\S]*?)(?=\n\s*\d+\.|$)/
//           )?.[1] || "";
//         const steps = stepsSection
//           .split(/\d+\.\s+/)
//           .filter(Boolean)
//           .map((step) => step.trim());

//         return {
//           name,
//           currentPrice: currentPrice?.replace("$", "").trim(),
//           originalPrice: originalPrice?.replace("$", "").trim(),
//           description,
//           productLink,
//           coupons,
//           cashback,
//           steps,
//           expiration,
//         };
//       })
//       .filter((deal) => deal.name && deal.productLink);

//     console.log("**Parsed Deals:**");
//     console.log(deals); // Inspect the parsed deals

//     return deals;
//   };

//   const handleInputChange = (e) => {
//     setQuery(e.target.value);
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setResponse(null);
//     setError("");

//     if (!query.trim()) {
//       setError("Please enter a search query.");
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

//       const deals = parseAIResponse(data);
//       if (deals.length === 0) {
//         setError("No deals found. Please try a different search.");
//       } else {
//         setResponse({ deals });
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.error ||
//           "An error occurred while searching for deals. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateSavings = (deal) => {
//     const original = parseFloat(
//       deal.originalPrice?.replace(/[^0-9.]/g, "") || "0"
//     );
//     const current = parseFloat(
//       deal.currentPrice?.replace(/[^0-9.]/g, "") || "0"
//     );

//     if (original && current) {
//       const savings = original - current;
//       const percentage = (savings / original) * 100;
//       return {
//         amount: savings.toFixed(2),
//         percentage: percentage.toFixed(1),
//       };
//     }
//     return null;
//   };

//   const handleDealClick = (link) => {
//     if (!link) {
//       setError("No link available for this deal.");
//       return;
//     }

//     try {
//       const cleanUrl = link.trim().replace(/\s+/g, "");
//       new URL(cleanUrl); // Validate URL format
//       window.open(cleanUrl, "_blank", "noopener,noreferrer");
//     } catch {
//       setError("Invalid URL format for this deal.");
//     }
//   };

//   return (
//     <Section
//       className="pt-[12rem] -mt-[5.25rem] flex flex-col justify-center items-center min-h-screen"
//       id="hero"
//     >
//       {/* Header */}
//       <div className="container relative z-2 text-center">
//         <Heading
//           className="md:max-w-md lg:max-w-2xl mx-auto"
//           title="Shop smarter. Save bigger. Experience the future of deal hunting."
//         />
//       </div>

//       {/* Search Form */}
//       <div className="mt-8 w-full max-w-3xl flex items-center space-x-4 px-4">
//         <form
//           className="flex-grow flex items-center bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-full p-2"
//           onSubmit={handleSubmit}
//         >
//           <input
//             type="text"
//             value={query}
//             onChange={handleInputChange}
//             placeholder="Search for products, deals, or discounts..."
//             className="flex-grow bg-transparent border-none outline-none text-white px-4 py-2"
//           />
//           <Button
//             type="submit"
//             className="flex items-center gap-2"
//             disabled={loading}
//           >
//             <Search size={20} />
//             <span>Search</span>
//           </Button>
//         </form>
//       </div>

//       {/* Loading and Error States */}
//       {loading && (
//         <div className="mt-8 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//         </div>
//       )}

//       {error && (
//         <div className="mt-8 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg text-center">
//           {error}
//         </div>
//       )}

//       {/* Deals Display */}
//       {response?.deals && response.deals.length > 0 && (
//         <div className="mt-8 w-full max-w-7xl px-4">
//           <div className="container relative z-2 text-center mb-8">
//             <Heading
//               className="md:max-w-md lg:max-w-2xl mx-auto"
//               title={`Found ${response.deals.length} Deal${
//                 response.deals.length > 1 ? "s" : ""
//               }`}
//             />
//           </div>

//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {response.deals.map((deal, index) => {
//               const savings = calculateSavings(deal);
//               const isExpanded = expandedDeals[index];

//               return (
//                 <div
//                   key={index}
//                   className="card bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
//                 >
//                   <div className="p-6">
//                     {/* Deal Header */}
//                     <div className="flex justify-between items-start mb-4">
//                       <h2 className="text-xl font-bold text-white">
//                         {deal.name}
//                       </h2>
//                       <div className="flex flex-col items-end">
//                         {deal.originalPrice && (
//                           <div className="text-sm text-gray-400 line-through">
//                             ${deal.originalPrice}
//                           </div>
//                         )}
//                         <div className="text-2xl font-bold text-white">
//                           ${deal.currentPrice}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Savings Badge */}
//                     {savings && (
//                       <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full inline-flex items-center gap-2 mb-4">
//                         <DollarSign size={16} />
//                         <span>
//                           Save ${savings.amount} ({savings.percentage}% off)
//                         </span>
//                       </div>
//                     )}

//                     {/* Description */}
//                     {deal.description && (
//                       <p className="text-gray-300 mb-4">{deal.description}</p>
//                     )}

//                     {/* Expand/Collapse Button */}
//                     <button
//                       onClick={() => toggleDealExpansion(index)}
//                       className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4"
//                     >
//                       {isExpanded ? (
//                         <>
//                           <ChevronUp size={20} />
//                           <span>Show less</span>
//                         </>
//                       ) : (
//                         <>
//                           <ChevronDown size={20} />
//                           <span>Show more details</span>
//                         </>
//                       )}
//                     </button>

//                     {/* Extended Info */}
//                     {isExpanded && (
//                       <div className="space-y-4 mt-4 border-t border-gray-700 pt-4">
//                         {/* Coupons Section */}
//                         {deal.coupons && deal.coupons.length > 0 && (
//                           <div className="space-y-2">
//                             <h3 className="text-lg font-semibold text-white flex items-center gap-2">
//                               <Tag size={18} />
//                               Available Coupons
//                             </h3>
//                             <div className="space-y-2">
//                               {deal.coupons.map((coupon, idx) => (
//                                 <div
//                                   key={idx}
//                                   className="bg-gray-800/50 p-3 rounded-lg"
//                                 >
//                                   <div className="font-mono text-green-400">
//                                     {coupon.code}
//                                   </div>
//                                   <div className="text-sm text-gray-300">
//                                     {coupon.description}
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                         {/* Cashback Section */}
//                         {deal.cashback && deal.cashback.length > 0 && (
//                           <div className="space-y-2">
//                             <h3 className="text-lg font-semibold text-white flex items-center gap-2">
//                               <Percent size={18} />
//                               Cashback Offers
//                             </h3>
//                             <div className="space-y-2">
//                               {deal.cashback.map((offer, idx) => (
//                                 <div
//                                   key={idx}
//                                   className="bg-gray-800/50 p-3 rounded-lg"
//                                 >
//                                   <div className="font-semibold text-white">
//                                     {offer.platform}
//                                   </div>
//                                   <div className="text-green-400">
//                                     {offer.amount}
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                         {/* Steps Section */}
//                         {deal.steps && deal.steps.length > 0 && (
//                           <div className="space-y-2">
//                             <h3 className="text-lg font-semibold text-white">
//                               How to Get This Deal
//                             </h3>
//                             <ol className="list-decimal list-inside space-y-1 text-gray-300">
//                               {deal.steps.map((step, idx) => (
//                                 <li key={idx}>{step}</li>
//                               ))}
//                             </ol>
//                           </div>
//                         )}

//                         {/* Expiration */}
//                         {deal.expiration && (
//                           <div className="flex items-center gap-2 text-sm text-gray-400">
//                             <Clock size={16} />
//                             <span>Expires: {deal.expiration}</span>
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* Action Button */}
//                     <div className="mt-6">
//                       <Button
//                         onClick={() => handleDealClick(deal.productLink)}
//                         className="w-full flex items-center justify-center gap-2"
//                       >
//                         <ExternalLink size={20} />
//                         <span>View Deal</span>
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
