import React, { useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentModal = () => {
  const [showDownload, setShowDownload] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openRazorpay = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY", // ✅ Replace with your real Razorpay key
      amount: 9900, // ₹99 = 9900 paise
      currency: "INR",
      name: "SOP Creator",
      description: "Download SOP",
      handler: function (response: any) {
        alert("Payment successful!");
        setShowDownload(true);
        setShowModal(false);
      },
      theme: {
        color: "#007bff"
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Save Document</button>

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0,
          width: "100%", height: "100%",
          background: "rgba(0,0,0,0.7)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            width: "90%",
            maxWidth: "400px"
          }}>
            <h2>Finish Payment to Download</h2>
            <p>This document costs ₹99 to download.</p>
            <button onClick={openRazorpay} style={{ marginRight: '10px' }}>Proceed</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showDownload && (
        <div style={{ marginTop: "20px" }}>
          <a href="/assets/sop.zip" download>
            <button>Download SOP</button>
          </a>
        </div>
      )}
    </>
  );
};

export default PaymentModal;
