import { convertArray } from "three/src/animation/AnimationUtils.js";
import Axios from "../Axios/Axios";

export const addBrand = async (name) => {
  try {
    console.log(name, "in brand...added");
    let addBrand = await Axios.post("/inventory/brands/", { name });
    return addBrand;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getBrand = async () => {
  try {
    let brands = await Axios.get("/inventory/brands");
    console.log(brands, "brand");
    return brands;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getBrandForuser = async () => {
  try {
    let brands = await Axios.get("/inventory/view_brand_allow_any/");
    console.log(brands, "brand");
    return brands;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const deleteBrand = async (id) => {
  try {
    console.log(id, "in api");
    let deletedBrand = await Axios.delete(`/inventory/brands/${id}/`);
    console.log(deletedBrand);
    return deletedBrand;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const addCategory = async (data) => {
  try {
    console.log(data, "data category");
    let categoryAdded = await Axios.post("inventory/categories/", data);
    return categoryAdded;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const addSubCategory = async (data) => {
  try {
    console.log(data, "data category");
    let categoryAdded = await Axios.post("/inventory/subcategories/", data);
    return categoryAdded;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getCategory = async () => {
  try {
    let category = await Axios.get("/inventory/categories/");
    return category;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getSubCategory = async () => {
  try {
    let subcategory = await Axios.get("/inventory/subcategories/");
    return subcategory;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getCategoryForUser = async () => {
  try {
    let category = await Axios.get("/inventory/view_category_allow_any/");
    return category;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const deleteCategory = async (id) => {
  try {
    console.log(id, "in api");
    let deleteCate = await Axios.delete(`/inventory/categories/${id}/`);
    console.log(deleteCate);
    return deleteCate;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteSubCategory = async (id) => {
  try {
    console.log(id, "in api");
    let deleteCate = await Axios.delete(`/inventory/subcategories/${id}/`);
    console.log(deleteCate);
    return deleteCate;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getTax = async () => {
  try {
    let taxes = await Axios.get("/inventory/taxes/");
    console.log(taxes, "taxes");
    return taxes;
  } catch (error) {
    console.log(error);
  }
};
export const DeleteTax = async (id) => {
  try {
    let taxDelete = Axios.delete(`/inventory/taxes/${id}/`);
    return taxDelete;
  } catch (error) {
    console.log(error);
  }
};
export const AddTax = async (data) => {
  try {
    let taxesAdd = await Axios.post("/inventory/taxes/", data);
    console.log(taxesAdd, "add tax");
    return taxesAdd;
  } catch (error) {
    console.log(error);
    return error;
  }
};
// export const AddoverViewCategory = async ()=>{
//     try {
//         let overViewCate = await Axios.post('')
//     } catch (error) {

//     }
// }

// const ViewOverViewCate = async ()=>{
//     try {

//     } catch (error) {

//     }
// }

// const AddOverViewItem = async ()=>{
//     try {

//     } catch (error) {

//     }
// }

export const viewAllOverView = async () => {
  try {
  } catch (error) {}
};

export const addProduct = async (productDetails) => {
  try {
    console.log("Product Details Input:", productDetails);

    const data = new FormData();

    // Required fields with proper type conversions
    // data.append('product_code', productDetails.get('product_code') || '');
    data.append("name", productDetails.get("name"));
    data.append("brand", Number(productDetails.get("brand"))); // Make sure it's a number
    data.append("description", productDetails.get("description"));
    data.append("category", Number(productDetails.get("category"))); // Make sure it's a number
    data.append("subcategory", Number(productDetails.get("subcategory"))); // Make sure it's a number
    data.append("mrp", Number(productDetails.get("mrp"))); // Convert to number
    data.append("price", Number(productDetails.get("price"))); // Convert to number
    data.append("stock", Number(productDetails.get("stock"))); // Convert to integer
    data.append("whats_inside", productDetails.get("whats_inside"));
    data.append("warranty_info", productDetails.get("warranty_info"));

    // Optional fields (only append if available)
    const discount = productDetails.get("discount_price");
    if (discount && discount !== "") {
      data.append("discount_price", Number(discount));
    }

    const isAvailable = productDetails.get("is_available");
    if (isAvailable !== null && isAvailable !== undefined) {
      data.append(
        "is_available",
        isAvailable === "true" || isAvailable === true ? true : false
      );
    }

    const priceBT = productDetails.get("price_before_tax");
    if (priceBT && priceBT !== "") {
      data.append("price_before_tax", Number(priceBT));
    }

    const taxAmount = productDetails.get("tax_amount");
    if (taxAmount && taxAmount !== "") {
      data.append("tax_amount", taxAmount);
    }

    const taxValue = productDetails.get("tax_value");
    if (taxValue && taxValue !== "") {
      data.append("tax_value", Number(taxValue)); // Converting to integer
    }

    const youtubeUrl = productDetails.get("youtube_url");
    if (youtubeUrl) {
      data.append("youtube_url", youtubeUrl);
    }

    const moreInfo = productDetails.get("more_info");
    if (moreInfo) {
      data.append("more_info", moreInfo);
    }

    // Handle file upload - use broacher as shown in the component
    const broacher = productDetails.get("broacher");
    if (broacher) {
      data.append("broacher", broacher);
    }

    console.log("FormData entries:");
    for (let pair of data.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    let response = await Axios.post("/inventory/product_admin/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error(
      "Error adding product:",
      error.response?.data || error.message || error
    );
    throw error;
  }
};

export const getAnalytics = async () => {
  try {
    const response = await Axios.get("/analytics/customer-analytics/");
    console.log(response.data, "in controller response");
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
};

export const getinsights = async () => {
  try {
    const response = await Axios.get("/analytics/insights/");
    return response;
  } catch (error) {
    return error;
  }
};
export const getDashBoard = async () => {
  try {
    const response = await Axios.get("/analytics/dashboard-summary/");
    return response;
  } catch (error) {
    return error;
  }
};
export const updateBrand = async (data) => {
  try {
    console.log(data);
    let id = data.id;
    const response = await Axios.put(`/inventory/brands/${id}/`, data);
    console.log(response);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateCategory = async (data) => {
  try {
    let id = data.id;
    console.log(data, "data in category");
    const response = await Axios.put(`/inventory/categories/${id}/`, data);
    console.log(response, ",.,.,.");
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateSubCategory = async (data) => {
  try {
    let id = data.id;
    console.log(data, "data in category");
    const response = await Axios.put(`/inventory/subcategories/${id}/`, data);
    console.log(response, ",.,.,.");
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const updateStatus = async (id, status) => {
  try {
    console.log("Updating status for product ID:", id, "to status:", status);
    console.log(id, status, "in update status");
    let delivery_status = status;
    const response = await Axios.post(
      `/orders/admin/orders/${id}/update_status/`,
      { delivery_status }
    );
    console.log(response, "response in update status");
    return response;
  } catch (error) {
    console.error("Error updating product status:", error);
    throw error;
  }
};

export const AddProductToDropDownCategory = async (data) => {
  try {
    console.log(data, "in controller");
    const response = await Axios.post(
      "/advertisement/product/category-products/",
      data
    );
    console.log(response.data, "in controller response");
    return response.data;
  } catch (error) {
    console.error("Error fetching overview:", error);
    return null;
  }
};

export const getProductsFromDropdownCategory = async (categoryId) => {
  try {
    // console.log(categoryId, "in controller");
    const response = await Axios.get(
      `/advertisement/product/category-products/${categoryId}/`
    );
    // console.log(response.data, "in controller response, 1234");
    return response.data;
  } catch (error) {
    // console.error("Error fetching overview:", error);
    return null;
  }
};

export const createHeroCarouselForDropDown = async (data) => {
  try {
    const response = await Axios.post(
      `/advertisement/product/hero-carousels/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("✅ Success:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
    //   console.error("❌ Server responded with 400 error:");
    //   console.error("Status:", error.response.status);
    //   console.error("Data:", error.response.data); // ⬅️ this is what we need
    } else {
    //   console.error("❌ Network or other error:", error.message);
    }
    return null;
  }
};


export const getHeroCarouselForDropDownFromCategory = async (slug) => {
  try {
    const response = await Axios.get(
      `/advertisement/product/categories/${slug}/`);
    console.log("✅ Success:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
    //   console.error("❌ Server responded with 400 error:");
    //   console.error("Status:", error.response.status);
    //   console.error("Data:", error.response.data); // ⬅️ this is what we need
    } else {
    //   console.error("❌ Network or other error:", error.message);
    }
    return null;
  }
};


export const deleteHeroCarouselForDropDownFromCategory = async (id) => {
  try {
    const response = await Axios.delete(
      `/advertisement/product/hero-carousels/${id}/`);
    console.log("✅ Success:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
    //   console.error("❌ Server responded with 400 error:");
    //   console.error("Status:", error.response.status);
    //   console.error("Data:", error.response.data); // ⬅️ this is what we need
    } else {
    //   console.error("❌ Network or other error:", error.message);
    }
    return null;
  }
};


export const updateHeroCarouselForDropDownFromCategory = async (id, data) => {
  try {
    const response = await Axios.patch(
      `/advertisement/product/hero-carousels/${id}/`,data);
    console.log("✅ Success:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
    //   console.error("❌ Server responded with 400 error:");
    //   console.error("Status:", error.response.status);
    //   console.error("Data:", error.response.data); // ⬅️ this is what we need
    } else {
    //   console.error("❌ Network or other error:", error.message);
    }
    return null;
  }
};

// specification from product category 

export const updateSpecificationForDropDownFromCategory = async (id, data) => {
  try {
    const response = await Axios.patch(
      `/advertisement/product/specifications/${id}/`,data);
    console.log("✅ Success:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
    //   console.error("❌ Server responded with 400 error:");
    //   console.error("Status:", error.response.status);
    //   console.error("Data:", error.response.data); // ⬅️ this is what we need
    } else {
    //   console.error("❌ Network or other error:", error.message);
    }
    return null;
  }
};


export const createSpecificationForDropDownFromCategory = async ( data) => {
  try {
    const response = await Axios.post(
      `/advertisement/product/specifications/`,data);
    console.log("✅ Success:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ Server responded with 400 error:");
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data); // ⬅️ this is what we need
    } else {
      console.error("❌ Network or other error:", error.message);
    }
    return null;
  }
};


export const getSpecificationForDropDownFromCategory = async () => {
  try {
    const response = await Axios.get(
      `/advertisement/product/specifications/`);
    console.log("✅ Success:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
    //   console.error("❌ Server responded with 400 error:");
    //   console.error("Status:", error.response.status);
    //   console.error("Data:", error.response.data); // ⬅️ this is what we need
    } else {
    //   console.error("❌ Network or other error:", error.message);
    }
    return null;
  }
};


export const deleteSpecificationForDropDownFromCategory = async (id) => {
  try {
    const response = await Axios.delete(
      `/advertisement/product/specifications/${id}/`);
    console.log("✅ Success:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
    //   console.error("❌ Server responded with 400 error:");
    //   console.error("Status:", error.response.status);
    //   console.error("Data:", error.response.data); // ⬅️ this is what we need
    } else {
    //   console.error("❌ Network or other error:", error.message);
    }
    return null;
  }
};

export const getProductBySlug = async (slug) => {
  try {
    
    const response = await Axios.get(`/advertisement/product/categories/${slug}/`);
    console.log("----Success----:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ Server responded with 400 error:");
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data); // ⬅️ this is what we need
    } else {
      console.error("❌ Network or other error:", error.message);
    }
    return null;
  }
}

export const DeleteProductByIdSlug = async (id) => {
  try {
    console.log("Deleting product with ID:", id);
    const response = await Axios.delete(`/advertisement/product/category-products/${id}/`);
    console.log("✅ Success:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ Server responded with 400 error:");
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data); // ⬅️ this is what we need
    } else {
      console.error("❌ Network or other error:", error.message);
    }
    return null;
  }
}
export const getPageData = async (slug) => {
    try {
        const response = await Axios.get(`/advertisement/product/categories/${slug}/page-data/`);
        console.log("Page Data:", response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("❌ Server responded with 400 error:");
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data); // ⬅️ this is what we need
        } else {
            console.error("❌ Network or other error:", error.message);
        }
        return null;
    }
}
