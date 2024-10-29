import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  nike,
  ebay,
  adidas,
  shopping,
  clothing,
  walmart,
  BestBuy,
  nikes,
  jumia,
  zara,
  amazon,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  yourlogo,
} from "../assets";

export const ACCESS_TOKEN = "access";
export const REFRESH_TOKEN = "refresh";

export const navigation = [
  {
    id: "0",
    title: "Features",
    url: "#features",
  },
  {
    id: "1",
    title: "Pricing",
    url: "pricing",
  },

  {
    id: "4",
    title: "New account",
    url: "Register",
    onlyMobile: true,
  },
  {
    id: "5",
    title: "Sign in",
    url: "login",
    onlyMobile: true,
  },

  {
    id: "6",
    title: "Home",
    url: "/",
    onlyMobile: true,
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo];

export const brainwaveServices = [
  "Photo generating",
  "Photo enhance",
  "Seamless Integration",
];

export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
];

export const roadmap = [
  {
    id: "0",
    title: "Voice recognition",
    text: "Enable the chatbot to understand and respond to voice commands, making it easier for users to interact with the app hands-free.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap1,
    colorful: true,
  },
  {
    id: "1",
    title: "Gamification",
    text: "Add game-like elements, such as badges or leaderboards, to incentivize users to engage with the chatbot more frequently.",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap2,
  },
  {
    id: "2",
    title: "Chatbot customization",
    text: "Allow users to customize the chatbot's appearance and behavior, making it more engaging and fun to interact with.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap3,
  },
  {
    id: "3",
    title: "Integration with APIs",
    text: "Allow the chatbot to access external data sources, such as weather APIs or news APIs, to provide more relevant recommendations.",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap4,
  },
];

export const collabText =
  "Deala's advanced AI scans a vast network of top e-commerce sites in real-time, ensuring you always see the lowest available price.";

export const collabContent = [
  {
    id: "0",
    title: "Real-Time Price Comparison",
    text: collabText,
  },
  {
    id: "1",
    title: "Smart Automation",
  },
  {
    id: "2",
    title: "Top-notch Security",
  },
];

export const collabApps = [
  {
    id: "0",
    title: "Shopping",
    icon: amazon,
    width: 26,
    height: 36,
  },
  {
    id: "1",
    title: "Nike",
    icon: nikes,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "Zara",
    icon: zara,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "Best",
    icon: BestBuy,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "Ebay",
    icon: ebay,
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "Jumia",
    icon: jumia,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "Adidas",
    icon: adidas,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "Raindrop",
    icon: raindrop,
    width: 38,
    height: 32,
  },
];

export const pricing = [
  {
    id: "1",
    title: "Standard",
    description: "Search for deals across multiple websites",
    price: "73.99",
    features: [
      "Get recommendations that feel like they're from a friend who knows your taste",
      "Find hidden gems across the web while you sit back and relax",
      "Every price, every store, one beautiful overview",
    ],
    variantId: "561937",
  },
];

export const benefits = [
  {
    id: "0",
    title: "Chat Your Way to Savings",
    text: "Forget complex search filters. Just tell Deala what you're looking for in your own words. It understands context, preferences, and even reads between the lines to find exactly what you need.",
    backgroundUrl: "assets/benefits/card-1.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Deal Detective",
    text: "Deala doesn't just match keywords—it comprehends. It analyzes thousands of listings across the internet in seconds, understanding quality, value, and relevance to deliver results that truly matter to you.",
    backgroundUrl: "assets/benefits/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "See the Bigger Picture",
    text: "Don't settle for the first price you see. Deala automatically compares offers from multiple retailers, factoring in shipping costs, taxes, and even historical pricing data to ensure you're getting the best.",
    backgroundUrl: "assets/benefits/card-3.svg",
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
  },
  {
    id: "3",
    title: "Deal Streamer",
    text: "In the fast-paced world of online shopping, timing is everything. Deala provides a constant, real-time flow of the latest and greatest deals",
    backgroundUrl: "assets/benefits/card-4.svg",
    iconUrl: benefitIcon4,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "4",
    title: "Smart Shopper",
    text: "Deala isn't just a tool; it's a companion that grows with you. With each interaction, our AI refines its understanding of your tastes and preferences..",
    backgroundUrl: "assets/benefits/card-5.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
  },
  {
    id: "5",
    title: "One AI for Everything",
    text: "From high-tech gadgets to vintage vinyl, designer fashion to rare collectibles—if it's for sale online, our AI can find it. No category is too niche, no search too specific.",
    backgroundUrl: "assets/benefits/card-6.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
  },
];

export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discordBlack,
    url: "#",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl: twitter,
    url: "https://www.x.com/bumpymark",
  },
  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "https://www.instagram.com/mark_kaave",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "https://www.facebook.com/marcorpai",
  },
];
