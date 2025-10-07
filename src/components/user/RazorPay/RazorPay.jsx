function RenderRazorpay({ amount, currency, orderId, keyId, keySecret }) {
    return (
      <div>
        <h3>Processing Payment</h3>
        <p>Amount: {amount}</p>
        <p>Currency: {currency}</p>
        <p>Order ID: {orderId}</p>
        <p>Key ID: {keyId}</p>
      </div>
    );
  }
  
  export default RenderRazorpay;
  