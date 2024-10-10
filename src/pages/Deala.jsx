import Section from "../components/Section";
import Button from "../components/Button";
import { useState } from "react";
import axios from "axios";
import Heading from "../components/Heading";
import ButtonGradient from "../assets/svg/ButtonGradient";
import { ACCESS_TOKEN } from "../constants";
import { service1, service2, service3, check } from "../assets";
import withSubscription from "../components/withSubscription";

const Hero = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResponse(null);
    setError("");

    if (!query.trim()) {
      setError("Query cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending request to backend...");
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

      console.log("Received response from backend:", data);
      setResponse(data);
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

  console.log(
    "Current state - loading:",
    loading,
    "response:",
    response,
    "error:",
    error
  );

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem] flex flex-col justify-center items-center min-h-screen"
      id="hero"
    >
      <div className="container relative z-2 text-center">
        <Heading
          className="md:max-w-md lg:max-w-2xl mx-auto"
          title="Shop smarter. Save bigger. Experience the future of deal hunting."
        />
      </div>

      <div className="mt-8 w-full max-w-3xl flex items-center space-x-4 px-4">
        <form
          className="flex-grow bg-transparent border border-gray-300 rounded-full p-2"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for deals online"
            className="w-full bg-transparent border-none outline-none text-white px-4 py-2 rounded-full"
          />
        </form>

        <Button type="button" onClick={handleSubmit}>
          Search
        </Button>
      </div>

      {loading && <span className="loading loading-dots loading-lg"></span>}

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {response && (
        <div className="mt-8 max-w-6xl">
          {/* <h3 className="text-lg font-bold text-gray-800">AI Response</h3>
          <p className="text-gray-700">{response.ai_response}</p> */}
          <div className="container relative z-2 text-center">
            <Heading
              className="md:max-w-md lg:max-w-2xl mx-auto"
              title="Deals"
            />
          </div>
          {/* <h4 className="mt-4 font-bold text-gray-800">Deals Found:</h4> */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {response.deals && response.deals.length > 0 ? (
              response.deals.map((deal, index) => (
                <div key={index} className="card glass w-full">
                  <figure>
                    <img
                      src={service1} // Assuming deal.image contains the URL for the deal image
                      alt={deal.name}
                      className="w-full h-48 object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{deal.name}</h2>
                    <p>{deal.description}</p>
                    <p className="font-bold">${deal.price}</p>
                    <div className="card-actions justify-end">
                      <Button
                        href={deal.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        type="button"
                      >
                        View Deal
                      </Button>
                      {/* <a
                        href={deal.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Deal
                      </a> */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No deals found.</p>
            )}
          </div>
        </div>
      )}

      <ButtonGradient />
    </Section>
  );
};

export default withSubscription(Hero);

// import Section from "../components/Section";
// import Button from "../components/Button";
// import { useState } from "react";
// import axios from "axios";
// import Heading from "../components/Heading";
// import ButtonGradient from "../assets/svg/ButtonGradient";
// import { ACCESS_TOKEN } from "../constants";

// const Hero = () => {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState("");

//   const handleInputChange = (e) => {
//     setQuery(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setResponse(null);
//     setError("");

//     if (!query.trim()) {
//       setError("Query cannot be empty.");
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log("Sending request to backend...");
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

//       console.log("Received response from backend:", data);
//       setResponse(data);
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

//   console.log(
//     "Current state - loading:",
//     loading,
//     "response:",
//     response,
//     "error:",
//     error
//   );

//   return (
//     <Section
//       className="pt-[12rem] -mt-[5.25rem] flex flex-col justify-center items-center min-h-screen"
//       id="hero"
//     >
//       <div className="container relative z-2 text-center">
//         <Heading
//           className="md:max-w-md lg:max-w-2xl mx-auto"
//           title="Shop smarter. Save bigger. Experience the future of deal hunting."
//         />
//       </div>

//       <div className="mt-8 w-full max-w-3xl flex items-center space-x-4 px-4">
//         <form
//           className="flex-grow bg-transparent border border-gray-300 rounded-full p-2"
//           onSubmit={handleSubmit}
//         >
//           <input
//             type="text"
//             value={query}
//             onChange={handleInputChange}
//             placeholder="Search for deals online"
//             className="w-full bg-transparent border-none outline-none text-gray-700 px-4 py-2 rounded-full"
//           />
//         </form>

//         <Button type="button" onClick={handleSubmit}>
//           Search
//         </Button>
//       </div>

//       {loading && (
//         <p className="mt-4 text-gray-500">Processing your query...</p>
//       )}

//       {error && <p className="mt-4 text-red-500">{error}</p>}

//       {response && (
//         <div className="mt-8 p-4 border border-gray-300 rounded-l max-w-3xl">
//           <h3 className="text-lg font-bold">AI Response</h3>
//           <p>{response.ai_response}</p>
//           <h4 className="mt-4 font-bold">Deals Found:</h4>
//           <ul className="list-disc list-inside">
//             {response.deals && response.deals.length > 0 ? (
//               response.deals.map((deal, index) => (
//                 <li key={index}>
//                   <strong>{deal.name}</strong> - ${deal.price}
//                   <br />
//                   {deal.description}
//                   <br />
//                   <a href={deal.link} target="_blank" rel="noopener noreferrer">
//                     View Deal
//                   </a>
//                 </li>
//               ))
//             ) : (
//               <li>No deals found.</li>
//             )}
//           </ul>
//         </div>
//       )}

//       <ButtonGradient />
//     </Section>
//   );
// };

// export default Hero;
