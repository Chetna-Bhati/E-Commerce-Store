import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import AddressForm from '../components/checkout/AddressForm';
import PaymentSelector from '../components/checkout/PaymentSelector';
import OrderSummary from '../components/cart/OrderSummary';

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const { items, summary, appliedCoupon, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street_address: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103'
  });

  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      addToast('Please log in to proceed with checkout.', 'info');
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate, addToast]);

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();

    // Validate address
    if (!address.name || !address.phone || !address.street_address || !address.city || !address.state || !address.pincode) {
      addToast('Please complete all required shipping address fields.', 'error');
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      addToast('Please enter a valid 6-digit PIN code.', 'error');
      return;
    }

    try {
      setLoading(true);

      // 1. Initialize checkout on backend (verifies stock & creates Razorpay order if online)
      const createRes = await api.post('/checkout/create', {
        address,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon ? appliedCoupon.code : null
      });

      if (!createRes.data.success) {
        throw new Error(createRes.data.message || 'Checkout initialization failed');
      }

      const checkoutData = createRes.data.data;

      // 2. Handle Online Payment via Razorpay
      if (paymentMethod === 'ONLINE') {
        const razorpayKey = checkoutData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';

        if (typeof window.Razorpay !== 'undefined') {
          const options = {
            key: razorpayKey,
            amount: Math.round(checkoutData.amount * 100),
            currency: 'INR',
            name: 'Threadline Retail',
            description: 'Everyday Clothes. Fair Prices.',
            order_id: checkoutData.razorpayOrderId.startsWith('order_mock_') ? undefined : checkoutData.razorpayOrderId,
            prefill: {
              name: address.name,
              email: user.email,
              contact: address.phone
            },
            theme: {
              color: '#111111'
            },
            handler: async function (response) {
              await verifyAndCommitOrder({
                razorpay_order_id: response.razorpay_order_id || checkoutData.razorpayOrderId,
                razorpay_payment_id: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || 'test_signature',
                payment_method: 'ONLINE',
                address,
                coupon_code: appliedCoupon ? appliedCoupon.code : null
              });
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
                addToast('Payment cancelled.', 'info');
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Fallback if Razorpay SDK script is blocked in testing: mock successful test capture
          await verifyAndCommitOrder({
            razorpay_order_id: checkoutData.razorpayOrderId,
            razorpay_payment_id: `pay_test_${Date.now()}`,
            razorpay_signature: 'test_mode_verified',
            payment_method: 'ONLINE',
            address,
            coupon_code: appliedCoupon ? appliedCoupon.code : null
          });
        }
      } else {
        // 3. Handle Cash on Delivery Flow
        await verifyAndCommitOrder({
          payment_method: 'COD',
          address,
          coupon_code: appliedCoupon ? appliedCoupon.code : null
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Payment processing failed';
      addToast(msg, 'error');
      setLoading(false);
    }
  };

  const verifyAndCommitOrder = async (payload) => {
    try {
      const verifyRes = await api.post('/checkout/verify', payload);
      if (verifyRes.data.success) {
        const orderInfo = verifyRes.data.data;
        await clearCart();
        addToast('Order placed successfully!', 'success');
        navigate(`/orders/${orderInfo.orderNumber}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to finalize order';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-heading text-xl text-[#111111]">Your cart is empty</h2>
        <Link to="/products" className="inline-block px-5 py-2.5 bg-[#111111] text-white text-xs font-bold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-[#E2E2E0] pb-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl text-[#111111] tracking-tight">Checkout</h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">Complete your delivery address and payment method</p>
        </div>
        <Link to="/cart" className="text-xs font-bold text-[#111111] hover:text-[#F97316] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Edit Bag</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Address and Payment Selector */}
        <div className="lg:col-span-7 space-y-6">
          <AddressForm address={address} onChange={setAddress} />
          <PaymentSelector selectedMethod={paymentMethod} onSelectMethod={setPaymentMethod} />
        </div>

        {/* Right: Summary and Place Order */}
        <div className="lg:col-span-5">
          <OrderSummary
            summary={summary}
            appliedCoupon={appliedCoupon}
            showCouponInput={false}
            actionButton={
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full py-4 px-6 bg-[#111111] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider hover:bg-[#2B2B2B] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 rounded shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#F97316]" />
                    <span>Securing Transaction...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>Place Order ({paymentMethod === 'ONLINE' ? 'Pay Online' : 'Cash on Delivery'})</span>
                  </>
                )}
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
