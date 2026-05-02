"use client";

import { useEffect, useRef } from "react";

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  keyId: string;
  customerName: string;
  customerEmail: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

export function RazorpayCheckout({
  orderId,
  amount,
  keyId,
  customerName,
  customerEmail,
  onSuccess,
  onError,
}: RazorpayCheckoutProps) {
  const razorpayRef = useRef<any>(null);

  useEffect(() => {
    if (!orderId || !keyId) return;

    const options = {
      key: keyId,
      amount: amount,
      currency: "INR",
      name: "MyPlanzo",
      description: "Booking payment",
      order_id: orderId,
      handler: (response: any) => {
        onSuccess(response.razorpay_payment_id);
      },
      prefill: {
        name: customerName,
        email: customerEmail,
      },
      theme: { color: "#785964" },
    };

    // Load Razorpay SDK dynamically
    const loadRazorpay = () => {
      if ((window as any).Razorpay) {
        razorpayRef.current = new (window as any).Razorpay(options);
        razorpayRef.current.open();
      }
    };

    if (!(window as any).Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = loadRazorpay;
      script.onerror = () => onError("Failed to load payment gateway");
      document.body.appendChild(script);
    } else {
      loadRazorpay();
    }

    return () => {
      if (razorpayRef.current) {
        razorpayRef.current.close();
      }
    };
  }, [orderId, keyId, amount, customerName, customerEmail, onSuccess, onError]);

  return null;
}