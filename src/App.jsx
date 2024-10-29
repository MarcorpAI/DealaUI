import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Deala from "./pages/Deala";
import ProtectedRoute from "./components/ProtectedRoute";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";
import VerifyEmail from "./pages/VerifyEmail";
import EmailVerification from "./components/EmailVerification";
import PoliciesPage from "./pages/PolicyPage";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

const App = () => {
  return (
    <BrowserRouter>
      <div className="pt-4[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />{" "}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Benefits />
                <Collaboration />
                <Pricing />
                <Footer />
                <ButtonGradient />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/policy" element={<PoliciesPage />} />
          <Route
            path="/deala"
            element={
              <ProtectedRoute>
                <Deala />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import ButtonGradient from "./assets/svg/ButtonGradient";
// import Header from "./components/Header";
// import Hero from "./components/Hero";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Deala from "./pages/Deala";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Benefits from "./components/Benefits";
// import Collaboration from "./components/Collaboration";
// import Pricing from "./components/Pricing";
// import Footer from "./components/Footer";

// function Logout() {
//   localStorage.clear();
//   return <Navigate to="/login" />;
// }

// function RegisterAndLogout() {
//   localStorage.clear();
//   return <Register />;
// }

// const App = () => {
//   return (
//     <BrowserRouter>
//       <div className="pt-4[4.75rem] lg:pt-[5.25rem] overflow-hidden">
//         <Header />
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <>
//                 <Hero />
//                 <Benefits />
//                 <Collaboration />
//                 <Pricing />
//                 <Footer />
//                 <ButtonGradient />
//               </>
//             }
//           />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<RegisterAndLogout />} />
//           <Route path="/pricing" element={<Pricing />} />
//           <Route
//             path="/deala"
//             element={
//               <ProtectedRoute>
//                 <Deala />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// };

// export default App;
