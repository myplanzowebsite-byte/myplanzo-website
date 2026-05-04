"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingStatus } from "@prisma/client";
import { RazorpayCheckout } from "./RazorpayCheckout";

export function BookingActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<{
    orderId: string;
    amount: number;
    keyId: string;
  } | null>(null);

  async function initiatePayment() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        setMsg(data.error || "Payment start failed");
        return;
      }

      if (data.mode === "mock") {
        // Dev mode - capture immediately
        await fetch("/api/payments/mock-capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });
        setMsg("Mock payment captured (dev mode)");
        router.refresh();
      } else {
        // Live mode - open Razorpay checkout
        setPaymentData({
          orderId: data.orderId,
          amount: data.amount,
          keyId: data.keyId,
        });
      }
    } catch {
      setMsg("Payment failed");
    } finally {
      setLoading(false);
    }
  }

  async function handlePaymentSuccess(paymentId: string) {
    try {
      const res = await fetch("/api/payments/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, paymentId }),
      });
      
      if (res.ok) {
        setMsg("Payment successful!");
        router.refresh();
      } else {
        setMsg("Payment verification failed");
      }
    } catch {
      setMsg("Payment verification failed");
    }
    setPaymentData(null);
  }

  function handlePaymentError(error: string) {
    setMsg(error);
    setPaymentData(null);
  }

  if (status === "CONFIRMED") {
    return (
      <div className="pt-2 space-y-2">
        <button
          type="button"
          onClick={initiatePayment}
          disabled={loading}
          className="rounded-md bg-mp-charcoal px-4 py-2 text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
        >
          {loading ? "Processing…" : "Pay now"}
        </button>
        {msg ? <p className="text-xs text-mp-muted">{msg}</p> : null}
        
        {paymentData && (
          <RazorpayCheckout
            orderId={paymentData.orderId}
            amount={paymentData.amount}
            keyId={paymentData.keyId}
            customerName=""
            customerEmail=""
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}
      </div>
    );
  }

  return null;
}
