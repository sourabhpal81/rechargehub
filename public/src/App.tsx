import React, { useState, useEffect } from 'react';
import { User, CreditCard, ShoppingCart, Bell, Calendar, CheckCircle, Trash2, Plus, Minus, Package, Users, LogOut, ArrowLeft } from 'lucide-react';

const RechargeSubscriptionSystem = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [products] = useState([
    { id: 1, name: 'Premium Mobile Case', price: 499, image: '📱', stock: 50 },
    { id: 2, name: 'Wireless Earbuds', price: 1299, image: '🎧', stock: 30 },
    { id: 3, name: 'Power Bank 10000mAh', price: 899, image: '🔋', stock: 45 },
    { id: 4, name: 'Phone Screen Guard', price: 199, image: '🛡️', stock: 100 }
  ]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [rechargeRequests, setRechargeRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regOperator, setRegOperator] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authTab, setAuthTab] = useState('login');
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingPincode, setShippingPincode] = useState('');

  const indianOperators = ['Airtel', 'Jio', 'Vi (Vodafone Idea)', 'BSNL', 'MTNL'];

  const subscriptionPlans = [
    { id: 1, name: '6 Months Plan', duration: 6, price: 2999 },
    { id: 2, name: '12 Months Plan', duration: 12, price: 5499 }
  ];

  // PhonePe Configuration (Replace with your actual credentials for production)
  const PHONEPE_MERCHANT_ID = 'PGTESTPAYUAT'; // Test Merchant ID
  const PHONEPE_SALT_KEY = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399'; // Test Salt Key
  const PHONEPE_SALT_INDEX = 1;
  const PHONEPE_API_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'; // Sandbox URL
  const PHONEPE_STATUS_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status';

  useEffect(() => {
    setUsers([{
      id: 'USR001',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '9876543210',
      operator: 'Airtel',
      subscription: {
        plan: '6 Months Plan',
        startDate: '2024-11-01',
        endDate: '2025-05-01',
        totalMonths: 6,
        rechargedMonths: 2
      }
    }]);

    setOrders([{
      id: 'ORD001',
      userId: 'USR001',
      userName: 'Rajesh Kumar',
      userPhone: '9876543210',
      items: [{ productId: 1, productName: 'Premium Mobile Case', quantity: 2, price: 499 }],
      total: 998,
      status: 'Delivered',
      orderDate: '2024-10-15',
      shippingAddress: '123 Main St, Mumbai, 400001',
      paymentMethod: 'PhonePe'
    }]);
  }, []);

  const showNotif = (msg) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleLogin = () => {
    if (loginEmail === 'admin@admin.com' && loginPassword === 'admin') {
      setIsAdmin(true);
      setIsLoggedIn(true);
      setCurrentUser({ name: 'Admin', email: 'admin@admin.com' });
      showNotif('Admin logged in successfully!');
    } else {
      const user = users.find(u => u.email === loginEmail);
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
        showNotif('Welcome back!');
      } else {
        showNotif('Invalid credentials!');
      }
    }
  };

  const handleRegister = () => {
    if (!regName || !regEmail || !regPhone || !regOperator) {
      showNotif('Please fill all fields!');
      return;
    }
    const newUser = {
      id: 'USR' + String(users.length + 1).padStart(3, '0'),
      name: regName,
      email: regEmail,
      phone: regPhone,
      operator: regOperator,
      subscription: null
    };
    setUsers([...users, newUser]);
    showNotif('Registration successful! Please login.');
    setAuthTab('login');
  };

  const handleSubscribe = (plan) => {
    if (!currentUser) return;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);

    const updatedUser = {
      ...currentUser,
      subscription: {
        plan: plan.name,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        totalMonths: plan.duration,
        rechargedMonths: 0
      }
    };

    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    
    const request = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      operator: currentUser.operator,
      phone: currentUser.phone,
      status: 'pending',
      requestDate: new Date().toISOString()
    };
    setRechargeRequests([...rechargeRequests, request]);
    showNotif('Subscription activated!');
  };

  const handleRecharge = (requestId) => {
    const updatedRequests = rechargeRequests.map(r => 
      r.id === requestId ? { ...r, status: 'completed' } : r
    );
    setRechargeRequests(updatedRequests);
    showNotif('Recharge completed!');
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showNotif('Added to cart!');
  };

  const updateCartQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    showNotif('Item removed!');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // PhonePe Payment Integration Functions
  const generateRandomString = (length) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateSha256Hash = async (data) => {
    const msgUint8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handlePhonePePayment = async () => {
    if (!shippingAddress || !shippingCity || !shippingPincode) {
      showNotif('Please fill shipping details!');
      return;
    }

    const merchantTransactionId = 'ORD' + Date.now();
    const merchantUserId = currentUser.id;
    const amount = getCartTotal() * 100; // Amount in paise
    const callbackUrl = window.location.origin + '/callback'; // Adjust as needed
    const redirectUrl = window.location.origin + '/success'; // Success page

    // Prepare request body
    const requestBody = {
      request: {
        merchantId: PHONEPE_MERCHANT_ID,
        merchantTransactionId,
        merchantUserId,
        amount,
        redirectUrl,
        callbackUrl,
        mobileNumber: currentUser.phone,
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      }
    };

    const base64Body = btoa(JSON.stringify(requestBody));

    // Generate X-VERIFY checksum
    const stringToHash = '/pg/v1/pay' + base64Body + PHONEPE_SALT_KEY;
    const checksum = await generateSha256Hash(stringToHash) + '###' + PHONEPE_SALT_INDEX;

    // Make API call to PhonePe (In production, move this to backend for security)
    try {
      showNotif('Initiating payment...');
      const response = await fetch(PHONEPE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Payment initiation failed');
      }

      const data = await response.json();
      if (data.success === true) {
        // Redirect to PhonePe payment page
        window.location.href = data.data.instrumentResponse.redirectInfo.url;
      } else {
        showNotif('Payment initiation failed: ' + data.message);
      }
    } catch (error) {
      showNotif('Error: ' + error.message);
    }
  };

  // Handle callback from PhonePe (Add this route in your backend)
  const handlePaymentCallback = async () => {
    // This should be handled in backend for verification
    // For demo, simulate success
    const newOrder = {
      id: 'ORD' + String(orders.length + 1).padStart(3, '0'),
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      items: cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: getCartTotal(),
      status: 'Processing',
      orderDate: new Date().toISOString().split('T')[0],
      shippingAddress: shippingAddress + ', ' + shippingCity + ', ' + shippingPincode,
      paymentMethod: 'PhonePe'
    };

    setOrders([...orders, newOrder]);
    setCart([]);
    setShowCheckout(false);
    showNotif('Order placed successfully! Payment verified.');
    setActiveTab('myorders');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    showNotif('Status updated!');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
        {showNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {notificationMsg}
          </div>
        )}
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
              <CreditCard className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">RechargeHub</h1>
            <p className="text-gray-600 mt-2">Subscription & Recharge Management</p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAuthTab('login')}
              className={`flex-1 py-2 rounded-lg font-medium transition ${authTab === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthTab('register')}
              className={`flex-1 py-2 rounded-lg font-medium transition ${authTab === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Register
            </button>
          </div>

          {authTab === 'login' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition"
              >
                Login
              </button>
              <p className="text-xs text-center text-gray-500">Admin: admin@admin.com / admin</p>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Full Name"
              />
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Email"
              />
              <input
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Phone (10 digits)"
              />
              <select
                value={regOperator}
                onChange={(e) => setRegOperator(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Operator</option>
                {indianOperators.map(op => <option key={op} value={op}>{op}</option>)}
              </select>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Password"
              />
              <button
                onClick={handleRegister}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isAdmin) {
    const pendingRequests = rechargeRequests.filter(r => r.status === 'pending');
    return (
      <div className="min-h-screen bg-gray-50">
        {showNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {notificationMsg}
          </div>
        )}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold">Admin Panel</span>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="px-4 py-2 bg-red-500 text-white rounded-lg">
              Logout
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-lg font-medium ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-lg font-medium ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            >
              Product Orders
            </button>
          </div>

          {activeTab === 'dashboard' ? (
            <div>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-500 rounded-2xl p-6 text-white">
                  <Users className="w-10 h-10 mb-2" />
                  <h3 className="text-3xl font-bold">{users.length}</h3>
                  <p>Total Users</p>
                </div>
                <div className="bg-orange-500 rounded-2xl p-6 text-white">
                  <Bell className="w-10 h-10 mb-2" />
                  <h3 className="text-3xl font-bold">{pendingRequests.length}</h3>
                  <p>Pending Recharges</p>
                </div>
                <div className="bg-green-500 rounded-2xl p-6 text-white">
                  <Package className="w-10 h-10 mb-2" />
                  <h3 className="text-3xl font-bold">{orders.length}</h3>
                  <p>Total Orders</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Pending Recharge Requests</h2>
                {pendingRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pending requests</p>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map(req => (
                      <div key={req.id} className="border rounded-xl p-4">
                        <div className="flex justify-between mb-4">
                          <div>
                            <h3 className="font-bold">{req.userName}</h3>
                            <p className="text-sm text-gray-600">{req.phone} - {req.operator}</p>
                          </div>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Pending</span>
                        </div>
                        <button
                          onClick={() => handleRecharge(req.id)}
                          className="w-full bg-green-500 text-white py-2 rounded-lg"
                        >
                          Complete Recharge
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">All Users</h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Operator</th>
                      <th className="text-left py-3 px-4">Subscription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{user.id}</td>
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.operator}</td>
                        <td className="py-3 px-4">
                          {user.subscription ? (
                            <span className="text-green-600">{user.subscription.plan}</span>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Product Orders</h2>
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="border rounded-xl p-6">
                      <div className="flex justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-xl">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">Customer: {order.userName}</p>
                          <p className="text-sm text-gray-600">Phone: {order.userPhone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">₹{order.total}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold mb-2">Items:</h4>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between py-2">
                            <span>{item.productName} x{item.quantity}</span>
                            <span className="font-medium">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-sm text-gray-600 mb-4">Address: {order.shippingAddress}</p>

                      <div className="flex gap-2">
                        {order.status === 'Processing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Shipped')}
                            className="flex-1 bg-blue-500 text-white py-2 rounded-lg"
                          >
                            Mark as Shipped
                          </button>
                        )}
                        {order.status === 'Shipped' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Delivered')}
                            className="flex-1 bg-green-500 text-white py-2 rounded-lg"
                          >
                            Mark as Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50">
        {showNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {notificationMsg}
          </div>
        )}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={() => setShowCheckout(false)}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <span className="text-xl font-bold">Checkout</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Street Address"
                />
                <input
                  type="text"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City"
                />
                <input
                  type="text"
                  value={shippingPincode}
                  onChange={(e) => setShippingPincode(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Pincode"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">₹{getCartTotal()}</span>
                </div>
              </div>
              <button
                onClick={handlePhonePePayment}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold hover:shadow-lg transition"
              >
                Pay with PhonePe - ₹{getCartTotal()}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter(o => o.userId === currentUser?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notificationMsg}
        </div>
      )}
      
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">RechargeHub</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('products')} className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button onClick={() => setIsLoggedIn(false)} className="px-4 py-2 bg-red-500 text-white rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2 rounded-lg font-medium ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-lg font-medium ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('myorders')}
            className={`px-6 py-2 rounded-lg font-medium ${activeTab === 'myorders' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            My Orders
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
              <h2 className="text-3xl font-bold mb-2">{currentUser?.name}</h2>
              <p className="mb-4">ID: {currentUser?.id}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                  <p className="text-sm mb-1">Phone</p>
                  <p className="font-bold">{currentUser?.phone}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                  <p className="text-sm mb-1">Operator</p>
                  <p className="font-bold">{currentUser?.operator}</p>
                </div>
              </div>
            </div>

            {currentUser?.subscription ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-6">Subscription Status</h3>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Plan</p>
                    <p className="font-bold">{currentUser.subscription.plan}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Start Date</p>
                    <p className="font-bold">{currentUser.subscription.startDate}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">End Date</p>
                    <p className="font-bold">{currentUser.subscription.endDate}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
                  <div className="flex justify-between mb-2">
                    <span>Progress</span>
                    <span className="font-bold">{currentUser.subscription.rechargedMonths}/{currentUser.subscription.totalMonths} Months</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                    <div
                      className="bg-white rounded-full h-3"
                      style={{ width: `${(currentUser.subscription.rechargedMonths / currentUser.subscription.totalMonths) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-center mb-6">Choose Your Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscriptionPlans.map(plan => (
                    <div key={plan.id} className="border-2 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition">
                      <h4 className="text-2xl font-bold mb-2">{plan.name}</h4>
                      <p className="text-4xl font-bold text-blue-600 mb-2">₹{plan.price}</p>
                      <p className="text-gray-600 mb-6">{plan.duration} months</p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Monthly recharge notifications
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Admin-managed recharges
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Exclusive products
                        </li>
                      </ul>
                      <button
                        onClick={() => handleSubscribe(plan)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition"
                      >
                        Subscribe Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            {cart.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Shopping Cart</h3>
                  <span className="text-2xl font-bold text-blue-600">₹{getCartTotal()}</span>
                </div>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{item.image}</span>
                        <div>
                          <h4 className="font-bold">{item.name}</h4>
                          <p className="text-blue-600 font-bold">₹{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition"
                >
                  Proceed to Checkout - ₹{getCartTotal()}
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-6">Our Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <div key={product.id} className="border rounded-2xl p-4 hover:shadow-xl transition">
                    <div className="text-6xl text-center mb-4">{product.image}</div>
                    <h4 className="font-bold mb-2">{product.name}</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-2">₹{product.price}</p>
                    <p className="text-sm text-gray-600 mb-4">Stock: {product.stock}</p>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'myorders' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-6">My Orders</h3>
            {userOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-6">
                {userOrders.map(order => (
                  <div key={order.id} className="border rounded-xl p-6">
                    <div className="flex justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-xl">Order #{order.id}</h4>
                        <p className="text-sm text-gray-600">Date: {order.orderDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">₹{order.total}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h5 className="font-semibold mb-2">Items:</h5>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-2">
                          <span>{item.productName} x{item.quantity}</span>
                          <span className="font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">Shipping: {order.shippingAddress}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RechargeSubscriptionSystem;
