import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';

const Checkout = () => {
  const { cartList } = useSelector((state) => state.cart);
  const [orderId, setOrderId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const totalPrice = cartList.reduce(
    (price, item) => price + item.qty * item.price,
    0
  );

  // Load the Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      // Step 1: Create order in backend
      const order = await axios.post('http://localhost:5500/create-order', {
        amount: totalPrice * 100,
      });
      setOrderId(order.data.id);

      // Step 2: Trigger Razorpay payment
      const options = {
        key: 'rzp_test_9qTQHPya18r5mP', // Replace with your Razorpay test key
        amount: totalPrice * 100, // Razorpay works with amounts in paise
        currency: 'INR',
        name: 'Adit Qadri', // Replace with your shop name
        description: 'Test Transaction',
        image: 'https://www.shutterstock.com/image-vector/modern-question-neon-great-design-any-2100716032', // Replace with your logo URL (Optional)
        order_id: order.data.id, // The order ID created in backend
        handler: function (response) {
          // Handle successful payment here
          alert('Payment Successful. Payment ID: ' + response.razorpay_payment_id);
          setPaymentSuccess(true);
          // You can also send the response to the backend to verify the payment
        },
        prefill: {
          name: 'John Doe', // Prefilled details for the user
          email: 'john@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#3399cc', // Custom color for the payment modal
        },
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
        },
      };

      const rzp1 = new window.Razorpay(options);

      // Handle payment failure
      rzp1.on('payment.failed', function (response) {
        alert('Payment failed: ' + response.error.description);
        console.error(response.error);
      });

      rzp1.open();
    } catch (error) {
      console.error('Error in Razorpay Payment: ', error);
      alert('There was an issue with the payment. Please try again.');
    }
  };

  return (
    <section className="checkout-section">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            {paymentSuccess ? (
              <h3>Thank you! Your payment was successful.</h3>
            ) : (
              <>
                <h2>Checkout</h2>
                <div className="cart-summary">
                  <h4>Total Price: ₹{totalPrice}</h4>
                  <button className="btn btn-primary" onClick={handleRazorpayPayment}>
                    Pay Now
                  </button>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Checkout;
