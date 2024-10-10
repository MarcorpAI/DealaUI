import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { deala } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";

// Assuming you are storing the token in localStorage

const Header = () => {
  const pathName = useLocation();
  const [openNavigation, setOpenNavigation] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  // Check if the user is signed in by verifying the presence of the access token
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      setIsSignedIn(true); // User is signed in
    }
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[12] xl:mr-8" href="/">
          <img src={deala} width={190} height={40} alt="Deala" />
        </a>
        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-6 py-6 md:py-8 lg:mr-0.25 lg:text-xs lg:font-semibold ${
                  item.url === pathName.hash
                    ? "z-2 lg:text-n-1"
                    : "lg:text-n-1/50"
                } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </a>
            ))}
          </div>
          <HamburgerMenu />
        </nav>

        {/* Conditionally show buttons based on isSignedIn state */}
        {!isSignedIn ? (
          <>
            <a
              href="Register"
              className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
            >
              Create Account
            </a>
            <Button className="hidden lg:flex" href="Login">
              Sign In
            </Button>
          </>
        ) : (
          <Button className="hidden lg:flex" href="/deala">
            Start Saving
          </Button>
        )}

        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;

// import { useLocation } from "react-router-dom";
// import { disablePageScroll, enablePageScroll } from "scroll-lock";
// import { brainwave, maindeala, dealaresize, deal } from "../assets";
// import { dealaa } from "../assets";
// import { deala } from "../assets";
// import { navigation } from "../constants";
// import Button from "./Button";

// import MenuSvg from "../assets/svg/MenuSvg";
// import { HamburgerMenu } from "./design/Header";
// import { useState } from "react";
// const Header = () => {
//   const pathName = useLocation();
//   const [openNavigation, setopenNavigation] = useState(true);

//   const toggleNavigation = () => {
//     if (openNavigation) {
//       setopenNavigation(false);
//       enablePageScroll();
//     } else {
//       setopenNavigation(true);
//       disablePageScroll();
//     }
//   };

//   const handleClick = () => {
//     if (!openNavigation) return;
//     enablePageScroll();
//     setopenNavigation(false);
//   };

//   return (
//     <div
//       className={`fixed top-0 left-0 w-full z-50
//        border-b border-n-6 lg:bg-n-8/90
//     lg:backdrop-blur-sm ${
//       openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
//     }`}
//     >
//       <div
//         className="flex items-center px-5 lg:px-7.5
//         xl:px-10 max-lg:py-4"
//       >
//         <a className="block w-[12] xl:mr-8" href="/">
//           <img src={deala} width={190} height={40} alt="Deala" />
//         </a>
//         <nav
//           className={` ${
//             openNavigation ? "flex" : "hidden"
//           } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
//         >
//           <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
//             {navigation.map((item) => (
//               <a
//                 key={item.id}
//                 href={item.url}
//                 onClick={handleClick}
//                 className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
//                   item.onlyMobile ? "lg:hidden" : ""
//                 } px-6 py-6 md:py-8 lg:mr-0.25 lg:text-xs lg:font-semibold ${
//                   item.url === pathName.hash
//                     ? "z-2 lg:text-n-1"
//                     : "lg:text-n-1/50"
//                 } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
//               >
//                 {item.title}
//               </a>
//             ))}
//           </div>
//           <HamburgerMenu />
//         </nav>
//         <a
//           href="Register"
//           className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
//         >
//           Create Account
//         </a>
//         <Button className="hidden lg:flex" href="Login">
//           Sign In
//         </Button>
//         <Button
//           className="ml-auto lg:hidden"
//           px="px-3"
//           onClick={toggleNavigation}
//         >
//           <MenuSvg openNavigation={openNavigation} />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Header;
