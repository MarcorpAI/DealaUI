import React from 'react';

const ProductDescription = ({ description }) => {
  if (!description) {
    return null;
  }

  const extractSection = (text, sectionName) => {
    try {
      const regex = new RegExp(`\\[${sectionName}\\]:\\s*(.+?)(?=\\[|$)`, 's');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    } catch (error) {
      console.error(`Error extracting ${sectionName} section:`, error);
      return '';
    }
  };

  try {
    const sections = {
      overview: extractSection(description, 'Overview'),
      bestFor: extractSection(description, 'Best For'),
      value: extractSection(description, 'Value'),
      recommendation: extractSection(description, 'Recommendation')
    };

    const hasContent = Object.values(sections).some(section => section.length > 0);

    if (!hasContent) {
      return (
        <p className="text-gray-300 leading-relaxed">
          {description}
        </p>
      );
    }

    return (
      <div className="space-y-8">
        {sections.overview && (
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-gray-100 text-lg font-semibold mb-3">Overview</h3>
            <p className="text-gray-300 leading-relaxed">{sections.overview}</p>
          </div>
        )}
        
        {sections.bestFor && (
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-gray-100 text-lg font-semibold mb-3">Best For</h3>
            <p className="text-gray-300 leading-relaxed">{sections.bestFor}</p>
          </div>
        )}
        
        {sections.value && (
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-gray-100 text-lg font-semibold mb-3">Value</h3>
            <p className="text-gray-300 leading-relaxed">{sections.value}</p>
          </div>
        )}
        
        {sections.recommendation && (
          <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/50">
            <h3 className="text-gray-100 text-lg font-semibold mb-3">Recommendation</h3>
            <p className="text-gray-300 leading-relaxed">{sections.recommendation}</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error rendering product description:', error);
    return (
      <p className="text-gray-300 leading-relaxed">
        {description}
      </p>
    );
  }
};

export default ProductDescription;







// import React from 'react';

// const ProductDescription = ({ description }) => {
//   // Extract sections from the description using regex
//   const extractSection = (text, sectionName) => {
//     const regex = new RegExp(`\\[${sectionName}\\]:\\s*(.+?)(?=\\[|$)`, 's');
//     const match = text.match(regex);
//     return match ? match[1].trim() : '';
//   };

//   const sections = {
//     overview: extractSection(description, 'Overview'),
//     bestFor: extractSection(description, 'Best For'),
//     value: extractSection(description, 'Value'),
//     recommendation: extractSection(description, 'Recommendation')
//   };

//   return (
//     <div className="space-y-6">
//       <div className="space-y-4">
//         {sections.overview && (
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview</h3>
//             <p className="text-gray-700">{sections.overview}</p>
//           </div>
//         )}
        
//         {sections.bestFor && (
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Best For</h3>
//             <p className="text-gray-700">{sections.bestFor}</p>
//           </div>
//         )}
        
//         {sections.value && (
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Value</h3>
//             <p className="text-gray-700">{sections.value}</p>
//           </div>
//         )}
        
//         {sections.recommendation && (
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommendation</h3>
//             <p className="text-gray-700">{sections.recommendation}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDescription;