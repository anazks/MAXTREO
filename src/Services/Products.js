import Axios from '../../src/Axios/Axios';

const getAllProduct = async () => {
    try {
        const response = await Axios.get('/inventory/Products_view/');
        console.log(response.data,"------------");
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
};

const getAllProductAdmin = async () => {
    try {
        const response = await Axios.get('/inventory/product_admin/');
        console.log(response.data,"------------");
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
};

const getSingleProduct = async (id) => {
    try {
        const response = await Axios.get(`/inventory/Products_view_single/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching single product:', error);
        return null;
    }
};

const AddOverViewCategory = async(data)=>{
    try {
        console.log(data,"in controller");
       const response = await Axios.post('/inventory/productattribute_category/',data); 
       console.log(response.data,"in controller response");
        return response.data;
    } catch (error) {
        console.error('Error fetching overview:', error);
        return null; 
    }
}



const getOverViewCategory = async()=>{
    try {
        const response = await Axios.get('/inventory/productattribute_category/');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching overview:', error);
        return null; 
    }
}
const viewOverView = async()=>{
    try {
        const response = await Axios.get('/inventory/ProductAttributeCategoryListView');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching overview:', error);
        return null; 
    }
}
const addoverViewCate = async(data)=>{
    try {
        const response = await Axios.post('/inventory/productattribute/',data);
        console.log(response.data,"in controller response");
        return response.data;
    } catch (error) {
        console.error('Error fetching overview:', error);
        return null;  
    }
}
const updateProduct = async (id, data) => {
   try {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
    }
        const response = await Axios.patch(`/inventory/product_admin/${id}/`, 
            
            formData,  {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data, "in controller response");
        return response.data;
   } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }
   
}
const uploadProductPhotos = async (id, data) => {
    try {
        const response = await Axios.post(`/inventory/product/${id}/upload_photos/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data, "in controller response");
        return response.data;
    } catch (error) {
        console.error('Error uploading product photos:', error);
        return null;
    }
}

const addProductVideo = async (id, data) => {
    try {
        const response = await Axios.post(`/inventory/product/${id}/upload_video/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data, "in controller response");
        return response.data;
    } catch (error) {
        console.error('Error uploading product video:', error);
        return null;
    }
}
const addProductVariant = async (id, data) => {
    try {
        const response = await Axios.post(`/inventory/product/${id}/add_variant/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data, "in controller response");
        return response.data;
    } catch (error) {
        console.error('Error uploading product video:', error);
        return null;
    }
}
const addProductOverview =  async (id, data) => {
    try {
        const response = await Axios.post(`/inventory/product/${id}/add_overview/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data, "in controller response");
        return response.data;
    } catch (error) {
        console.error('Error uploading product video:', error);
        return null;
    }
} 
const relationShip = async () => {
    try {
        let relationShip = await Axios.get('/inventory/variant_relationship/')
        console.log(relationShip.data, "in controller response");
        return relationShip.data;
    } catch (error) {
        console.error('Error uploading product video:', error);
        return null;
    }
}

const addRelationShip = async (data) => {
    try {
        let relationShip = await Axios.post('/inventory/variant_relationship/', data)
        console.log(relationShip.data, "in controller response");
        return relationShip.data;
    } catch (error) {
        console.error('Error uploading product video:', error);
        return null;
    }
}

const AddVarient = async (data) => {
    try {
        console.log(data, "in controller");
        let product_id = parseInt(data.product_iddd)
        let variant_product_id = parseInt(data.variant_product_id)
        let relationship_id = parseInt(data.relationship)
        let relationship_value = data.name
        let newData = {
            product_id: product_id,
            variant_product_id: variant_product_id,
            relationship_id: relationship_id,
            relationship_value: relationship_value
        }
        let relationShip = await Axios.post('/inventory/product_variant/', newData)
        console.log(relationShip, "in controller response");
        return relationShip.data;
    } catch (error) {
        console.error('Error uploading product video:', error);
        return null;
    }
}
 const UpdateProductOverview = async (data) => {
    try {
        console.log(data, "...in controller");
        let Newdata = {
            product_id : parseInt(data.product_id),
            attribute_id:parseInt(data.overview_id)
        }
        console.log(Newdata,"Newdata")
        let response = await Axios.post('/inventory/productattribute_value/',Newdata)
        console.log(response,"response..")
        if(response.status==201){
                let ValueData = {
                    attribute_value_id: response.data?.data.id,
                    value:data.value
                }
                console.log(ValueData,"ValueData")
                let newResponse = await Axios.post('/inventory/productattribute_details/',ValueData)
                console.log(newResponse,"newResponse----")
                return newResponse
        }
       
    } catch (error) {
        console.error('Error uploading product video:', error);
        return null;
    }
}
const updateVideo = async(formData)=>{
    try {
        const product_id = formData.get("product_id"); // Use `get` to access FormData entries
        const vedio = formData.get("video")
        console.log(formData)
        let data = formData.get("video")
        console.log(product_id,"product_idproduct_id",vedio)
        console.log()
        
        const response = await Axios.post(
            `/inventory/products/${product_id}/add-video/`,
            formData,
            {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
        );
        console.log("Image upload response:", response);
        return response;
    } catch (error) {
        console.error('Error uploading product video:', error);
        return null; 
    }
}
const getAttribute = async(id,data)=>{
    try {
        let attributes = await Axios.get('/inventory/productattribute/')
        console.log(attributes)
        return  attributes
    } catch (error) {
        console.log(error)
    }
}
const uploadImage = async (formData) => {
    try {
        const product_id = formData.get("product_id"); // Use `get` to access FormData entries
        console.log(formData)
        const response = await Axios.post(
            `/inventory/products/${product_id}/add-image/`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        console.log("Image upload response:", response);
        return response.data;
    } catch (error) {
        console.error("Upload error:", error.response?.data || error.message);
        throw error;
    }
};

const productUpdate = async (id, data) => {
    try {
      console.log("Product ID:", id);
  
      // Convert 'tax' field to integer if it exists
    //   if (data.has('tax')) {
    //     const taxValue = data.get('tax');
    //     console.log(taxValue,typeof(taxValue),"--")
    //     if (taxValue !== null && taxValue !== '') {
    //       data.set('tax', parseInt(taxValue, 10));
    //     } else {
    //       data.delete('tax'); // remove empty tax
    //     }
    //   }
  
      console.log('FormData contents:');
      for (let pair of data.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
  
      let response = await Axios.patch(`/inventory/product_admin/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
  
      console.log("Response:", response);
      return response
    } catch (error) {
      console.error("Update error:", error.response || error.message || error);
      return error;
    }
  };
  
  
const productDelete = async(id)=>{
    try {
        let response = await Axios.delete(`/inventory/product_admin/${id}/`)
        console.log(response)
        return response
    } catch (error) {
       console.log(error)
       return error 
    }
}

const pairProdcut = async(formData)=>{
    try {
        let response = await Axios.post(`/inventory/product-pairings/`,formData)
        return response
    } catch (error) {
        console.log(error)
    }
}

const getPairedProduct = async(id)=>{
    try {
        let response = await Axios.get(`/inventory/products/${id}/with-pairings/`)
        console.log(response,"pairig ")
        return response
    } catch (error) {
        return error
    }
}

const Addrecomendation = async(data)=>{
    try {
        let response = await Axios.post('/inventory/recommendations/',data)
        return response
    } catch (error) {
        return error
    }
}
const recomendation = async(data)=>{
    try {
        let response = await Axios.get('/inventory/recommendations/')
        return response
    } catch (error) {
        return error
    }
}
const recentlyViewed = async()=>{
    try {
        let response = await Axios.get('/inventory/recommendations/')
        return response
    } catch (error) {
        return error
    }
}
const deletePairedProduct= async(id)=>{
    try {
        
    } catch (error) {
        
    }
}
const getVarient = async(id)=>{
    try {
        console.log(id,"---------------id")
        let response = await Axios.get(`/inventory/product_variant/${id}/`)
        return response
    } catch (error) {
        return error
    }
}
const payemntCallBack = async(data)=>{
    try {
        console.log(data,"data to call back")
        let response = await Axios.post('/orders/payment/callback/',data)
        console.log(response,"response from service after payemnt..")
        return response
    } catch (error) {
        console.log(error)
    }
}
const deleteVarient = async(id)=>{
    try {
        console.log(id,"---------------id")
        let response = await Axios.delete(`/inventory/product_variant/${id}/`)
        return response
    } catch (error) {
        return error
    }
}
const getImage = async(id)=>{
    try {
      let response =  await Axios.get(`/inventory/products/${id}/images/`)
      return response
    } catch (error) {
       return error 
    }
}

const TogglePrimaryImage = async(data)=>{
    try {
        console.log(data)
        let {imageId}= data
        let {productid} = data
      let response =  await Axios.get(`/inventory/products/${productid}/set-primary-image/${imageId}/`)
      return response
    } catch (error) {
       return error 
    }
}

const getVideos = async(id)=>{
    try {
      let response =  await Axios.get(`/inventory/products/${id}/videos/`)
      return response
    } catch (error) {
       return error 
    }
}
const deleteImage = async(data)=>{
    try {
        console.log(data)
        let {imageId}= data
        let {productid} = data
        let response = await Axios.delete(`/inventory/products/${productid}/delete-image/${imageId}/`)
        console.log(response,"deleted")
    } catch (error) {
        
    }
}


const deleteVideo = async(data)=>{
    try {
        console.log(data)
        let {videoId}= data
        let {productid} = data
        let response = await Axios.delete(`/inventory/products/${productid}/delete-video/${videoId}/`)
        console.log(response,"deleted")
    } catch (error) {
        
    }
}
const getReview = async()=>{
    try {
        let response = await Axios.get('/interactions/user/reviews/')
        return response
    } catch (error) {
        return error
    }
}
// Correct way to export multiple functions
const featuredProduct = async()=>{
        try {
            let response = await Axios.get('/inventory/featured-products/')
            return response
        } catch (error) {
            return error
        }
}
const dashBoardSummary = async()=>{
    try {
        let response = await Axios.get('/analytics/dashboard-summary/')
        return response
    } catch (error) {
        return error
    }
}



const getCustomerAnalytics = async(id)=>{
    try {
        let response = await Axios.get(`/analytics/customer-analytics/`)
        console.log(response,"pairig ")
        return response
    } catch (error) {
        return error
    }
}


const getCustomerInsights = async(id)=>{
    try {
        let response = await Axios.get(`/analytics/insights/`)
        console.log(response,"pairig ")
        return response
    } catch (error) {
        return error
    }
}

const refreshCustomerInsights = async()=>{
    try {
        let response = await Axios.post(`/analytics/customer-analytics/refresh_analytics/`)
        console.log(response,"pairig ")
        return response
    } catch (error) {
        return error
    }
}


const getOrderTimings = async()=>{
    try{
        let response = await Axios.get("/analytics/order-timing/")
        return response
    } catch (error){
        return error
    }
}


const getFeaturedNvidia = async()=> {
    try{
        let response = await Axios.get("/authentication/nvidia-images/featured/")
        return response
    } catch (error){
        return error
    }
}




export {dashBoardSummary,getAllProductAdmin,featuredProduct,getReview,deleteImage,getImage,deleteVarient,getVarient,payemntCallBack,Addrecomendation,deletePairedProduct,recomendation,recentlyViewed,getPairedProduct,pairProdcut,productDelete,productUpdate,uploadImage,getAttribute,updateVideo,getOverViewCategory,UpdateProductOverview,AddVarient,addRelationShip,relationShip,addProductOverview,addProductVariant,addProductVideo, uploadProductPhotos,getAllProduct, getSingleProduct,AddOverViewCategory,viewOverView,addoverViewCate,updateProduct,deleteVideo,getVideos, TogglePrimaryImage,getCustomerAnalytics,getCustomerInsights,refreshCustomerInsights,getOrderTimings, getFeaturedNvidia  };
