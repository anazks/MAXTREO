import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Products from "./Pages/user/Products";
import DetailedView from "./Pages/user/DetailedView";
import CardPage from "./components/user/CardPage/CartPage";
import Login from "./Pages/user/Login";
import LoginComponent from "./components/user/Login/Login";
import Recomends from "./components/user/Recomendation/Recomends";
import SupportPage from "./Pages/user/SupportPage";
import Register from "././components//user/Registraion/Register";
// import AboutUs from "./components/user/AboutUs/AboutUs";
// import Login from "./components/user/Login/Login";
// import AboutUs from "./Pages/user/AboutUs";
import Aboutuspage from "./components/user/AboutUs/Aboutuspage";
import AuthProvider from "./Context/UserContext";
// import Store from "./Pages/user/Store";
import AdminRoutes from "./Routes/AdminRoutes";
import Myorders from "./Pages/user/Myorders";
import GoogleLoginComponent from "./components/user/Google/GoogleLoginComponent";
import AddProducts from "./components/Admin/Products/AddProducts/AddProducts";
import OrderView from "./components/user/CardPage/OverView";
import Tokyo from "./components/user/Tickets/Tickets";
import TicketsResolved from "./components/user/Tickets/TicketsResolved";
import Ticket from "./components/user/Tickets/Tickets";
import Solutions from "./components/user/Solutions/Solutions__";
import Profile from "./components/user/Profile/Profile";
import ProfilePage from "./Pages/user/ProfilePage";
import Payed from "./components/user/RazorPay/Payed";
import Nvidia from "./components/user/Nvidia/Nvidia";
import Failed from "./components/user/RazorPay/Failed";
import Store from "./components/user/Store/Store";
import PurchasedProducts from "./components/user/PurchasedProducts/PurchasedProducts";
import NeoFooter from "./components/user/Footer/Footer";
import ContactPage from "./Pages/user/Contact";
import TeamNeo from "./components/user/PriorityOne/TeamNeo";
import PrivacyPolicy from './components/user/PoliciesAndRules/PrivacyPolicy';
import ReturnRefund from "./components/user/PoliciesAndRules/ReturnRefund";
import TermsConditions from "./components/user/PoliciesAndRules/TermsConditions"
import GamingPCShowcase from "./components/user/ProductShowcase/ProductGaming";
import NewUpdate from "./components/user/Solutions/NewUpdate";
import ErrorPage from "./components/user/Error/Error";
import ShippingPolicy from "./components/user/PoliciesAndRules/Shipping";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<LoginComponent />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/details/:id" element={<DetailedView />} />
          <Route path="/cart" element={<CardPage />} />
          <Route path="/special" element={<Recomends />} />
          <Route path="/Support" element={<SupportPage />} />
          <Route path="/about" element={<Aboutuspage />} />
          <Route path="/store" element={<Store />} />
          <Route path="/myorder" element={<Myorders />} />
          <Route path="/GoogleAuth" element={<GoogleLoginComponent />} />
          <Route path="/overView" element={<OrderView />} />
          <Route path="/tickets" element={<Ticket />} />
          <Route path="/ticketsresolved" element={<TicketsResolved />} />
          <Route path="/Solutions" element={<Solutions />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/payed" element={<Payed />} />
          <Route path="/nvidia" element={<Nvidia />} />
          <Route path="/failed" element={<Failed />} />
          <Route path="/my-products" element={<PurchasedProducts />} />
          <Route path="/showimage" element={<NeoFooter />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path='/team-neo' element={<TeamNeo/>}/>
          <Route path='//privacy-policy' element={<PrivacyPolicy/>}/>
          <Route path='/return-refunds' element={<ReturnRefund/>}/>
          <Route path='/teams-and-conditions' element={<TermsConditions/>}/>
          <Route path='/Shipping-Policy' element={<ShippingPolicy/>}/>



          {/* <Route path='/products/product/showcase' element={<GamingPCShowcase/>}/> */}
          <Route path='/products/product/:slug' element={<GamingPCShowcase/>}/>
          <Route path='/products/gaming-pc' element={<GamingPCShowcase/>}/>
          <Route path='/products/enterprise-solutions' element={<GamingPCShowcase/>}/>
          <Route path='/products/networking' element={<GamingPCShowcase/>}/>
          <Route path='/products/custom-servers' element={<GamingPCShowcase/>}/>
          <Route path='/products/nas-&-san' element={<GamingPCShowcase/>}/>
          <Route path='/products/render-farms' element={<GamingPCShowcase/>}/>
          <Route path='/products/vr-&-simulators' element={<GamingPCShowcase/>}/>
          <Route path='/products/hedt-systems-for-intensive-tasks-high-end-desktops' element={<GamingPCShowcase/>}/>
          <Route path='/products/gaming-and-professional-peripherals-monitor,-keyboards,-etc.' element={<GamingPCShowcase/>}/>
          <Route path='/products/cloud-computing' element={<GamingPCShowcase/>}/>
          <Route path='/products/custom-water-looping' element={<GamingPCShowcase/>}/>
          <Route path='/products/project-eden' element={<GamingPCShowcase/>}/>
          <Route path="/new-Solutions" element={<NewUpdate />} />
          <Route path="/Error" element={<ErrorPage/>} />


          {/* 
            <Route path="/admin/login" element={<AdminLogin/>}/>
            <Route path="/admin/Home" element={<AdminHome/>}/> */}
        </Routes>
        <AdminRoutes />
      </AuthProvider>
    </>
  );
}

export default App;
