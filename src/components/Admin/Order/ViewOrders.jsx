import React from 'react';
import { FiClock, FiEye, FiTruck, FiDollarSign, FiUser } from 'react-icons/fi';
import './ViewOrders.css';
function ViewOrders() {
  // Sample pending orders data
  const pendingOrders = [
    {
      id: 'ORD-2023-00145',
      customer: 'John Doe',
      date: '2023-05-15',
      items: 3,
      total: 187.94,
      paymentMethod: 'Credit Card',
      shippingAddress: '123 Main St, New York, NY',
      status: 'Processing'
    },
    {
      id: 'ORD-2023-00146',
      customer: 'Jane Smith',
      date: '2023-05-16',
      items: 5,
      total: 245.75,
      paymentMethod: 'PayPal',
      shippingAddress: '456 Oak Ave, Los Angeles, CA',
      status: 'Processing'
    },
    {
      id: 'ORD-2023-00147',
      customer: 'Robert Johnson',
      date: '2023-05-17',
      items: 2,
      total: 89.99,
      paymentMethod: 'Credit Card',
      shippingAddress: '789 Pine Rd, Chicago, IL',
      status: 'Awaiting Payment'
    },
    {
      id: 'ORD-2023-00148',
      customer: 'Emily Davis',
      date: '2023-05-17',
      items: 1,
      total: 129.99,
      paymentMethod: 'Credit Card',
      shippingAddress: '321 Elm Blvd, Houston, TX',
      status: 'Processing'
    },
    {
      id: 'ORD-2023-00149',
      customer: 'Michael Wilson',
      date: '2023-05-18',
      items: 4,
      total: 156.50,
      paymentMethod: 'Bank Transfer',
      shippingAddress: '654 Maple Ln, Phoenix, AZ',
      status: 'Awaiting Payment'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return (
          <span className="status-badge processing">
            <FiClock /> Processing
          </span>
        );
      case 'awaiting payment':
        return (
          <span className="status-badge awaiting-payment">
            <FiDollarSign /> Awaiting Payment
          </span>
        );
      default:
        return (
          <span className="status-badge pending">
            <FiClock /> Pending
          </span>
        );
    }
  };

  return (
    <div className="view-orders-container">
      <div className="orders-header">
        <h1>
          <FiClock /> Pending Orders
        </h1>
        <div className="orders-summary">
          <span className="summary-item">
            <strong>{pendingOrders.length}</strong> orders pending
          </span>
          <span className="summary-item">
            <strong>${pendingOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</strong> total value
          </span>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>
                <FiUser /> Customer
              </th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment Method</th>
              <th>Shipping Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map((order) => (
              <tr key={order.id}>
                <td className="order-id">{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{order.items}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>{order.paymentMethod}</td>
                <td className="shipping-address">{order.shippingAddress}</td>
                <td>{getStatusBadge(order.order_status)}</td>
                <td className="actions">
                  <button className="action-btn view-btn" title="View Order">
                    <FiEye />
                  </button>
                  <button className="action-btn process-btn" title="Process Order">
                    <FiTruck />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewOrders;