import Axios from '../Axios/Axios'

export const allFeaturedProducts =  async()=>{
    try {
        let Orders = await Axios.get('/inventory/featured-products/admin-list/')
        console.log(Orders,"Orders")
        return Orders
    } catch (error) {
        console.log(error)
        return error
    }
}