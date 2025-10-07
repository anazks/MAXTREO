import {React, useEffect, useState} from 'react';
import ProductFooter from '../Footer/ProductFooter';
import ModernNavbar from '../NavBar/NavBar';
import { getFeaturedNvidia } from '../../../Services/Products';

function Nvidia() {
  const [nvidiaPage, setNvidiaPage] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNvidiaPage = async () => {
      try {
        setLoading(true);
        let productData = await getFeaturedNvidia();
        console.log(productData, "data from nvidia..................");
        // Handle both single object and array responses
        if (Array.isArray(productData.data)) {
          setNvidiaPage(productData.data);
        } else if (productData.data) {
          setNvidiaPage([productData.data]); // Convert single object to array
        } else {
          setNvidiaPage(productData ? [productData] : []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNvidiaPage();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#292929]">
        <ModernNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
        <ProductFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#292929]">
      <ModernNavbar />
      
      {/* Main content with images */}
      <div className="w-full max-w-full overflow-x-hidden" style={{marginTop:"50px"}}>
        {nvidiaPage.length > 0 ? (
          nvidiaPage.map((item, index) => (
            <div key={item.id || index} className="w-full max-w-full mb-4">
              {item.link ? (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name_of_image || 'NVIDIA Graphics Card'}
                    className="w-full h-auto hover:opacity-90 transition-opacity duration-300"
                    loading="eager"
                  />
                </a>
              ) : (
                <img
                  src={item.image}
                  alt={item.name_of_image || 'NVIDIA Graphics Card'}
                  className="w-full h-auto"
                  loading="eager"
                />
              )}
            </div>
          ))
        ) : (
          <div className="w-full max-w-full mb-4 flex items-center justify-center min-h-96">
            <p className="text-white text-lg">No NVIDIA images available</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-auto">
        <ProductFooter />
      </div>
    </div>
  );
}

export default Nvidia;