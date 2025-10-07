import Axios from '../Axios/Axios'
export const AllOrders =  async()=>{
    try {
        let Orders = await Axios.get('/orders/admin/orders')
        console.log(Orders,"Orders")
        return Orders
    } catch (error) {
        console.log(error)
        return error
    }
}