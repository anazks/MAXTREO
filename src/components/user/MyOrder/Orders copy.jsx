import React, { useState, useEffect } from 'react';
import { getMyOrder } from '../../../Services/userApi';
import Loader from '../../../Loader/Loader';
import './Order.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  // Check for user's preferred color scheme on component mount
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(prefersDarkMode);
    }
  }, []);

  // Update document with dark mode class and save preference
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyOrder();
      if (response && response.data) {
        setOrders(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setSelectedOrder(prev => prev === orderId ? null : orderId);
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      delivered: {
        icon: '✓',
        label: 'Delivered',
        color: 'var(--success-color)',
        bgColor: 'var(--success-light)'
      },
      shipped: {
        icon: '🚚',
        label: 'Shipped',
        color: 'var(--primary-color)',
        bgColor: 'var(--primary-light)'
      },
      processing: {
        icon: '⋯',
        label: 'Processing',
        color: 'var(--processing-color)',
        bgColor: 'var(--processing-light)'
      },
      canceled: {
        icon: '✕',
        label: 'Canceled',
        color: 'var(--error-color)',
        bgColor: 'var(--error-light)'
      },
      default: {
        icon: '•',
        label: 'Pending',
        color: 'var(--text-light)',
        bgColor: 'var(--divider)'
      }
    };
    
    return statusMap[status?.toLowerCase()] || statusMap.default;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.order_status?.toLowerCase() === filterStatus);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={`error-state ${darkMode ? 'dark-mode' : ''}`}>
        <div className="error-icon">⚠️</div>
        <h2>Unable to Load Orders</h2>
        <p>{error}</p>
        <button onClick={fetchMyOrders} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={`empty-state ${darkMode ? 'dark-mode' : ''}`}>
        <div className="empty-state-icon">📦</div>
        <h2>No Orders Found</h2>
        <p>You haven't placed any orders yet. Browse our products and start shopping!</p>
        <button onClick={() => window.location.href = '/products'} className="browse-products-btn">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className={`orders-container ${darkMode ? 'dark-mode' : ''}`}>
      <br /><br /><br />
      <div className="orders-header">
        <div className="header-title-group">
          <h1>My Orders</h1>
          <button 
            onClick={toggleDarkMode} 
            className="theme-toggle"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="orders-actions">
          <div className="orders-filter">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Orders</option>
              <option value="delivered">Delivered</option>
              <option value="shipped">Shipped</option>
              <option value="processing">Processing</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          <div className="orders-stats">
            <span className="orders-count">{filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}</span>
          </div>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="filtered-empty-state">
          <p>No orders match the selected filter.</p>
          <button onClick={() => setFilterStatus('all')} className="reset-filter-btn">
            Show All Orders
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.order_status);
            
            return (
              <div 
                key={order.id} 
                className={`order-row ${selectedOrder === order.id ? 'expanded' : ''}`}
              >
                <div className="order-row-header" onClick={() => toggleOrderDetails(order.id)}>
                  <div className="order-primary-info">
                    <div className="order-id">
                      <span className="order-number">#invoice &nbsp;{order.invoice_number}</span>
                    </div>
                    <div className="order-id">
                      <span className="order-number">Order ID &nbsp;{order.payment_order_id}</span>
                    </div>
                    <div className="order-date-container">
                      <span className="order-date">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="order-amount">
                      <span className="amount">RS.{order.total_price || order.total_tax}</span>
                    </div>
                    <div className="order-amount">
                      <span className={`status-pill status-${order.order_status.toLowerCase()}`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                  {
                    order.items[0]?.image ? (
                      <div className="order-image">
                        <img
                          alt={order.items[0].product_name}
                          src={order.items[0].image}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = order.items[0].product_image;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="order-image-placeholder">
                        <span>No Image</span>
                      </div>
                    )
                  }
                  <div className="order-summary" style={{
                    backgroundImage: darkMode 
                      ? 'linear-gradient(rgba(30, 30, 30, 0.8), rgba(20, 20, 20, 0.9))' 
                      : `url(${order.items[0]?.product_image || ''})`,
                    backgroundSize: 'cover'
                  }}>
                    <div 
                      className="order-status-badge"
                      style={{
                        backgroundColor: statusConfig.bgColor,
                        color: statusConfig.color
                      }}
                    >
                      <span className="status-icon">{statusConfig.icon}</span>
                      <span className="status-text">{order.order_status}</span>
                    </div>
                    <div className="view-toggle">
                      <button 
                        className="toggle-button"
                        aria-expanded={selectedOrder === order.id}
                        aria-label={selectedOrder === order.id ? "Hide order details" : "Show order details"}
                      >
                        <span className="toggle-icon">{selectedOrder === order.id ? '−' : '+'}</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {selectedOrder === order.id && (
                  <div className="order-details-section">
                    <div className="order-progress">
                      <div className="order-timeline">
                        {['processing', 'shipped', 'delivered'].map((status, index) => {
                          const isCompleted = getOrderStatusRank(order.order_status) >= index;
                          const isCurrent = getOrderStatusRank(order.order_status) === index;
                          return (
                            <div key={status} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                              <div className="timeline-indicator"></div>
                              <div className="timeline-label">{status.charAt(0).toUpperCase() + status.slice(1)}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="order-items-list">
                      <h3 className="section-title">Order Items</h3>
                      {order.items.map((item) => (
                        <div key={`${order.id}-${item.id}`} className="order-item-row">
                          <div className="item-image">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name || item.product_name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = item.product_image;
                              }}
                            />
                          ) : (
                            <div className="image-placeholder">
                              <span>No Image</span>
                            </div>
                          )}
                          </div>
                          
                          <div className="item-details">
                            <h3 className="item-name">{item.product_name}</h3>
                            
                            {item.description && (
                              <p className="item-description">{item.description}</p>
                            )}
                            
                            <div className="item-attributes">
                              {item.sku && (
                                <span className="attribute">Price: {item.total_price}</span>
                              )}
                              
                              {item.brand && (
                                <span className="attribute">Qty: {item.quantity}</span>
                              )}
                              
                              {item.size && (
                                <span className="attribute">Tax Amount: {item.total_tax}</span>
                              )}
                              
                              {item.color && (
                                <span className="attribute">
                                  <span className="color-dot" style={{ backgroundColor: item.color }}></span>
                                  {item.color_name || item.color}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="item-price-qty">
                            <div className="item-quantity">Qty: {item.quantity}</div>
                            <div className="item-price">RS.{item.price || order.price_before_tax}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-info-grid">
                      <div className="shipping-info">
                        <h3>Shipping Details</h3>
                        <div className="info-card">
                          <div className="info-item">
                            <span className="info-label">Recipient:</span>
                            <span className="info-value">{order.delivery_address_details?.delivery_person_name || order.customer_name || 'Not specified'}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Address:</span>
                            <span className="info-value">{order.delivery_address_details?.address || 'Not specified'}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">City:</span>
                            <span className="info-value">{order.delivery_address_details?.district || 'Not specified'}</span>
                          </div>
                          {order.delivery_address_details?.state && (
                            <div className="info-item">
                              <span className="info-label">State:</span>
                              <span className="info-value">{order.delivery_address_details.state}</span>
                            </div>
                          )}
                          {order.delivery_address_details?.postal_code && (
                            <div className="info-item">
                              <span className="info-label">Postal Code:</span>
                              <span className="info-value">{order.delivery_address_details.postal_code}</span>
                            </div>
                          )}
                          {order.delivery_address_details?.phone_number && (
                            <div className="info-item">
                              <span className="info-label">Phone:</span>
                              <span className="info-value">{order.delivery_address_details.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="payment-info">
                        <h3>Payment Information</h3>
                        <div className="info-card">
                          <div className="info-item">
                            <span className="info-label">Method:</span>
                            <span className="info-value">{order.payment_method || 'Not specified'}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Status:</span>
                            <span className="info-value status-pill" style={{
                              backgroundColor: statusConfig.bgColor,
                              color: statusConfig.color
                            }}>
                              {order.payment_status}
                            </span>
                          </div>
                          {order.tracking_number && (
                            <div className="info-item">
                              <span className="info-label">Tracking:</span>
                              <span className="info-value">{order.payment_order_id}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="order-summary-card">
                          <h3>Order Summary</h3>
                          <div className="summary-row">
                            <span className="summary-label">Subtotal:</span>
                            <span className="summary-value">RS.{order.price_before_tax || order.subtotal || '0.00'}</span>
                          </div>
                          {order.shipping_cost !== undefined && (
                            <div className="summary-row">
                              <span className="summary-label">Shipping:</span>
                              <span className="summary-value">RS.{order.shipping_cost}</span>
                            </div>
                          )}
                          {order.tax !== undefined && (
                            <div className="summary-row">
                              <span className="summary-label">Tax:</span>
                              <span className="summary-value">RS.{order.tax}</span>
                            </div>
                          )}
                          {order.discount !== undefined && order.discount > 0 && (
                            <div className="summary-row discount">
                              <span className="summary-label">Discount:</span>
                              <span className="summary-value">-RS.{order.discount}</span>
                            </div>
                          )}
                          <div className="summary-row total">
                            <span className="summary-label">Total:</span>
                            <span className="summary-value">RS.{order.total_amount || order.price_before_tax}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper function to rank order statuses for the timeline
function getOrderStatusRank(status) {
  const statusRank = {
    'processing': 0,
    'shipped': 1,
    'delivered': 2,
    'canceled': -1
  };
  return statusRank[status?.toLowerCase()] ?? -1;
}