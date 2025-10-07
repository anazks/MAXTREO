    import React from 'react'
import NavBar from '../../components/user/NavBar/NavBar'
import ProductBanner from '../../components/user/ProductsBanner/ProductBanner'
// import Recomends from '../../components/user/Recomendation/Recomends'
import ProductsList from '../../components/user/Products/ProductsList'
import ProductFooter from '../../components/user/Footer/ProductFooter'
    
    function  Products() {
      return (
        <div>
            <NavBar/>
            <ProductBanner/>
            <ProductsList/>
            <ProductFooter/>
        </div>
      )
    }
    
    export default Products
    