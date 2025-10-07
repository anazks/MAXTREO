import React from 'react'
import ProductFooter from '../Footer/ProductFooter';
import ModernNavbar from '../NavBar/NavBar';
import { Star, ArrowUpRight } from 'lucide-react';
import Recomends from '../Recomendation/Recomends';

function Store() {

     // Partner logos
  const partners = [
    { name: "Intel", logo: "intel" },
    { name: "AMD", logo: "amd" },
    { name: "NVIDIA", logo: "nvidia" },
    { name: "Samsung", logo: "samsung" },
    { name: "Cooler Master", logo: "coolermaster" },
    { name: "Asus", logo: "asus" },
    { name: "Corsair", logo: "corsair" },
    { name: "Logitech", logo: "logitech" },
    { name: "Western Digital", logo: "westerndigital" }
  ];
  return (
    <div>

        <ModernNavbar/>

        <Recomends/>

  

        <ProductFooter/>

    </div>
  )
}

export default Store