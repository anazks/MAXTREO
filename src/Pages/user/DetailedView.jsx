import React, { useEffect, useState } from "react";
import Details from "../../components/user/ProductDetail/Details";
import Inside from "../../components/user/ProductDetail/Inside";
import Rating from "../../components/user/ProductDetail/Rating";
import ProductCard from "../../components/user/ProductDetail/ProductCard";
import ProductFooter from "../../components/user/Footer/ProductFooter";
import BestPairedWith from "../../components/user/BestPairedWith/BestPairedWith";
import { useParams } from "react-router-dom";
import { getSingleProduct } from "../../Services/Products";
import  Loader from "../../Loader/Loader"
function DetailedView() {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null); // Store product details
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product ID:", id);
        let productData = await getSingleProduct(id);
        console.log("Product data fetched:....", productData);
        if (!productData) {
          console.error("No product data found for ID:", id);
          return;
        }
        setProduct(productData); // Store product in state
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]); // ✅ Add dependency array to re-run when `id` changes

  if (loading) {
    return <Loader/>
  }

  return (
    <div>
      <Details product={product} /> {/* ✅ Pass product as prop */}
      <BestPairedWith product={product} />
      <Inside product={product}/>
      <Rating product={product}/>
      <ProductCard product={product}/>
      <ProductFooter/>
    </div>
  );
}

export default DetailedView;
