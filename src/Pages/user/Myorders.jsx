import React from 'react';
import Orders from '../../components/user/MyOrder/Orders';
import NavBar from '../../components/user/NavBar/NavBar';
import ProductFooter from '../../components/user/Footer/ProductFooter';
import './myorder.css'; // We'll create this CSS file

function Myorders() {
  return (
    <div className="myorders-page">
      <NavBar />
      <div className="myorders-content">
        <Orders />
      </div>
      <ProductFooter />
    </div>
  );
}

export default Myorders;