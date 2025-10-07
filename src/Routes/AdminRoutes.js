// src/routes/AdminRoutes.js
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Admin/Home';
import Dashboard from '../components/Admin/Dashboard';
import ViewProducts from '../components/Admin/Products/ViewProducts/ViewProducts';
import Order from '../components/Admin/Order/Order';
import ViewOrders from '../components/Admin/Order/ViewOrders';
import UserView from '../components/Admin/User/UserView';
import DetailedViewAdmin from '../components/Admin/Products/ViewProducts/DetailedView';
import LoginAdmin from '../Pages/Admin/Login'
import AddProducts from '../components/Admin/Products/AddProducts/AddProducts';
import Settings from '../components/Admin/Settings/Settings';
import OverView from '../components/Admin/OverView/OverView';
import UpdateProduct from '../components/Admin/Products/UpdateProducts/UpdateProduct';
import Tickets from '../components/Admin/Tickets/Tickets'
import OrderList from '../components/Admin/Order/OrderList';
import FeaturedProduct from '../components/Admin/FeaturedProduct/FeaturedProduct';
import Drivers from '../components/Admin/Drivers/Drivers';
import CustomerInsights  from '../components/Admin/CustomerInsights';
import BusinessInsights from '../components/Admin/BusinessInsights';
import NvidiaImageManager from '../components/Admin/NvidiaImageManager/NvidiaImageManager';
import ProductCategoryAdmin from '../components/Admin/Advertisement/Advertisement'

function AdminRoutes() {
  return (
    <Routes>
        <Route path="/admin/Login" element={<LoginAdmin/>} />
        <Route path="/admin/dashboard" element={<Dashboard/>} />
        <Route path="/admin/products" element={<ViewProducts/>} />
        <Route path="/admin/featured" element={<FeaturedProduct/>} />
        <Route path="/admin/orders" element={<Order/>} />
        <Route path="/admin/order-list" element={<OrderList/>} />
        <Route path="/admin/Vieworders" element={<ViewOrders/>} />
        <Route path="/admin/viewUsers" element={<UserView/>} />
        <Route path="/admin/AddProduct" element={<AddProducts/>} />
        <Route path="/admin/settings" element={<Settings/>} />
        <Route path="/admin/overview" element={<OverView/>} />
        <Route path="/admin/Updateproducts/:id" element={<UpdateProduct/>} />
        <Route path="/admin/products/:id" element={<DetailedViewAdmin/>} />
        <Route path='/admin/tickets'  element={<Tickets/>}/>
        <Route path='/admin/driver/update'  element={<Drivers/>}/>
        <Route path='/admin/customerinsights'  element={<CustomerInsights/>}/>
        <Route path='/admin/businessinsights'  element={<BusinessInsights/>}/>
        <Route path='/admin/nvidia-manager'  element={<NvidiaImageManager/>}/>
        <Route path='/admin/Advertisement/product'  element={<ProductCategoryAdmin/>}/>

        
    </Routes>
  );
}

export default AdminRoutes; 