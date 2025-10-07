// userApi.js - Fixed version
import axios from "axios";
import Axios from "../Axios/Axios";
import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";

const SECRET_KEY = "your_secret_key_123";

export const RegisterUser = async (data) => {
  try {
    console.log(data, "in js");
    const response = await Axios.post(
      "/authentication/user_registration/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(response.data, "userAPI from register user");
    return response;
  } catch (error) {
    console.error("Error registering user:", error);
    return error;
  }
};

export const OtpForUserRegistration = async (data, setToken, setIsAdmin) => {
  try {
    console.log(data, "in js");
    const response = await Axios.post(
      "/authentication/register/verify-otp/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(response.data, "userAPI from register Otp user");
    return response;
  } catch (error) {
    console.error("Error registering user:", error);
    return error;
  }
};

export const submitOTP = async (email) => {
  try {
    console.log(email, "in js");

    const response = await Axios.post(
      "/authentication/generate_otp/",
      { identifier: email },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log(response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return {
      success: false,
      error: error,
      // If we have response data with is_active status, include it
      isActive: error.response?.data?.is_active,
      errorMessage: error.response?.data?.error || "Something went wrong",
    };
  }
};

export const verifyOtp = async (email, otp, setToken, setIsAdmin) => {
  try {
    console.log(email, otp, "in js");

    const response = await Axios.post(
      "/authentication/verify_otp_and_login/",
      { identifier: email, otp: otp },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log(response.data, "response from verifyOtp");

    console.log(response.data.is_admin, "admin");
    if (response?.data?.access) {
      let token = response.data.access;
      let admin = response.data.is_admin;
      setIsAdmin(response.data.is_admin);
      // Set the token using setToken from context
      if (typeof setToken === "function") {
        setToken(token);
      } else {
        console.warn("setToken is not a function");
      }

      // Encrypt the token before storing it
      const encryptedToken = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();

      // Store the encrypted token in localStorage
      localStorage.setItem("token", encryptedToken);

      return { data: true, admin };
    } else {
      console.error("No access token in response data");
      return false;
    }
  } catch (error) {
    console.error(
      "Error verifying OTP:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};
export const decryptToken = () => {
  try {
    const encryptedToken = localStorage.getItem("token");
    if (!encryptedToken) return null;

    const decryptedToken = CryptoJS.AES.decrypt(
      encryptedToken,
      SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    return decryptedToken;
  } catch (error) {
    console.error("Error decrypting token:", error);
    return null;
  }
};
export const getUserInfo = async () => {
  try {
    // Get the encrypted token from localStorage
    const encryptedToken = localStorage.getItem("token");
    if (!encryptedToken) return null;

    // Decrypt the token
    const decryptedToken = CryptoJS.AES.decrypt(
      encryptedToken,
      SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (!decryptedToken) return null;

    // Decode the JWT token
    const tokenData = jwtDecode(decryptedToken);
    console.log("Token decoded:", tokenData);
    let user = await Axios.get(
      `authentication/get_user_data/${tokenData.user_id}`
    );
    console.log(user, "user in api ");
    return user;
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

export const addTocart = async (product_id) => {
  try {
    let quantity = 1;
    let cartAdded = await Axios.post(`orders/add_to_cart/`, {
      product_id,
      quantity,
    });
    console.log(cartAdded);
    return true;
  } catch (error) {
    return false;
  }
};

export const getMyCart = async () => {
  try {
    let myCart = await Axios.get(`orders/cart_detail/`);
    console.log(myCart, "cart-");
    return myCart;
  } catch (error) {
    return false;
  }
};

export const RemoveFromCart = async (item_id) => {
  try {
    const removecart = await Axios.post("orders/remove_from_cart/", {
      item_id,
    });
    return removecart;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const cartIncrement = async (product_id, cart_id) => {
  try {
    console.log(cart_id, product_id, "in user api");

    let increment = await Axios.post(
      `/orders/cart/${cart_id}/product/${product_id}/increase/`
    );
    console.log(increment, "inc");
    return increment;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const cartDecrement = async (product_id, cart_id) => {
  try {
    console.log(cart_id, product_id, "in user api");

    let increment = await Axios.post(
      `/orders/cart/${cart_id}/product/${product_id}/decrease/`
    );
    console.log(increment, "inc");
    return increment;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const CreateOrder = async (id) => {
  try {
    let delivery_address_id = id;
    let payments = await Axios.post(`/orders/order/cart/`, {
      delivery_address_id,
    });
    console.log(payments, "paymnets...callback");
    return payments;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const MakeRepayment = async (order_id) => {
  try {
    
    let payments = await Axios.post(`/orders/order/make_payment_on_failed_transaction/${order_id}/`);
    console.log(payments, "payments...callback");
    return payments;
  } catch (error) {
    console.log(error);
    return error;
  }
};


export const CreateSIngeleOrder = async (data) => {
  try {
    let delivery_address_id = data.address_id;
    let product_id = data.product_id;
    let newData = { delivery_address_id, product_id };
    console.log(data, "data in single order");
    let payments = await Axios.post(`/orders/order/single-product/`, newData);
    console.log(payments, "paymnets...callback");
    return payments;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const AddDelievryAddress = async (data) => {
  try {
    console.log(data, "in api--------");
    let address = await Axios.post("/authentication/delivery-addresses/", data);
    console.log(address);
    return address;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getMyDeliveryAddress = async () => {
  try {
    let address = await Axios.get("/authentication/delivery-addresses");
    console.log(address, "get my dev address");
    return address;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getMyPrimaryAddress = async () => {
  try {
    let primaryAddress = await Axios.get(
      "/authentication/delivery-addresses/primary/"
    );
    return primaryAddress;
  } catch (error) {
    return error;
  }
};

export const getMyOrder = async () => {
  try {
    let orders = await Axios.get("orders/user/orders/");
    console.log(orders, "my orders");
    return orders;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const addRatings = async (data) => {
  try {
    console.log(data, "in api-------");
    let rating = await Axios.post("/interactions/reviews/add/", data);
    console.log(rating, "rating============================");
    return rating;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getRatings = async (product_id) => {
  try {
    let ratings = await Axios.get(
      `/interactions/product/${product_id}/review-view`
    );
    return ratings;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const AddTicket = async (data) => {
  try {
    console.log("FormData contents:");
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value, "----");
    }
    console.log({data}, "data in AddTicket");
    let response = await Axios.post("/interactions/my-tickets/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response,"--- response from AddTicket");
    return response;
  } catch (error) {
    console.error("Error in AddTicket:", error);
    throw error;
  }
};

export const getmyTickets = async (data) => {
  try {
    let response = await Axios.get(`/interactions/my-tickets/`, data, {});
    console.log(response, "yhyhyh");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const AdminGetTickets = async () => {
  try {
    let response = await Axios.get("/interactions/admin/tickets/");
    console.log(response, "in user api");
    return response;
  } catch (error) {
    return error;
  }
};
export const AdminUpdateTicketStatus = async (data) => {
  try {
    console.log(data, "..........");
    let { selectedTicket } = data;
    let newData = {
      conclusion: data.conclusion,
      is_concluded: true,
    };
    let response = await Axios.put(
      `/interactions/admin/tickets/${selectedTicket.id}/`,
      newData
    );
    console.log(response, "response from ticketupdate");
    return response;
  } catch (error) {}
};

export const googleAuth = async (token) => {
  try {
    const response = await Axios.post("/authentication/auth/google/", {
      token: token,
    });
    console.log(response, "::");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const profileUpdate = async (data) => {
  try {
    console.log(data, "data in profile update ui");
    let response = await Axios.patch("/authentication/profile/update/", data);
    console.log(response, "update profile");
    return response;
  } catch (error) {
    return error;
  }
};

export const logout = async (refresh, token) => {
  console.log("Logging out with:", { refresh, token });

  try {
    const response = await fetch(
      "https://neotokyo.pythonanywhere.com/authentication/logout/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          refresh: refresh,
          access: token,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Server error response:", data);
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    console.log("Logout successful:", data);
    return data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const deleteMyAccount = async (data) => {
  try {
    let data = Axios.delete("/authentication/user/delete/");
    console.log(data);
    return data;
  } catch (error) {
    return error;
  }
};

export const getAllUsers = async () => {
  try {
    let response = await Axios.get("/authentication/admin/users/");
    return response;
  } catch (error) {
    return error;
  }
};
export const deleteUser = async (id) => {
  try {
    console.log(id, "user id");
    let response = Axios.delete(`/authentication/admin/user/${id}/delete/`);
    return response;
  } catch (error) {
    return error;
  }
};
export const ToggleUsers = async (id) => {
  try {
    let response = await Axios.post(
      `/authentication/admin/user/${id}/toggle-active/`
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getPurchasedProducts = async () => {
  try {
    let response = await Axios.get("/inventory/customer/purchased-products/");

    console.log(response.data);
    return response;
  } catch (error) {
    return error;
  }
};

export const getDrivers = async (product_id) => {
  try {
    console.log(product_id, "this is the product id form driver check");
    let response = await Axios.get(
      `/inventory/products/${product_id}/updates/`
    );

    console.log(response.data);
    return response;
  } catch (error) {
    return error;
  }
};

export const deletAddress = async (id) => {
  try {
    let response = await Axios.delete(
      `/authentication/delivery-addresses/${id}/`
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getInvoices = async (order_id) => {
  try {
    // This fetches the data AND triggers download
    let response = await Axios.get(`/orders/invoice/by_order/${order_id}/`, {
      responseType: "blob", // Tell axios to treat response as binary data
    });

    // Then create download link and trigger it
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice_${order_id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    return error;
  }
};

export const getProductDropDown = async ()=> {
  try {
    let response = await Axios.get("/advertisement/product/categories/");
    return response.data
  } catch (error){
    return error
  }
}
