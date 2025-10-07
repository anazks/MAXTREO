import NavBar from "../components/user/NavBar/NavBar";
import Product from '../components/user/Products/ProductsList';
import Footer from "../components/user/Footer/Footer";
import WelcomeHome from "../components/user/WelcomeHome/welcomepage";
function Home() {
  return (
    <div>
      <NavBar />
      <WelcomeHome/>
      <Product/>
      {/* <Product/> */}
      <Footer/>
    </div>
  );
}

export default Home;
