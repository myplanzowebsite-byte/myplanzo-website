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

interface RazorpayCheckoutResponse {
  razorpay_payment_id: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayCheckoutResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: { color: string };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

interface RazorpayWindow {
  Razorpay?: RazorpayConstructor;
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
  const razorpayRef = useRef<RazorpayInstance | null>(null);

  useEffect(() => {
    if (!orderId || !keyId) return;

    const options: RazorpayOptions = {
      key: keyId,
      amount: amount,
      currency: "INR",
      name: "MyPlanzo",
      description: "Booking payment",
      order_id: orderId,
      handler: (response: RazorpayCheckoutResponse) => {
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
      const Razorpay = (window as unknown as RazorpayWindow).Razorpay;
      if (Razorpay) {
        razorpayRef.current = new Razorpay(options);
        razorpayRef.current.open();
      }
    };

    const windowRazorpay = (window as unknown as RazorpayWindow).Razorpay;
    if (!windowRazorpay) {
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