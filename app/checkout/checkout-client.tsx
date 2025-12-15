"use client";

import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import CheckoutForm from "./checkout-form";
import Button from "../components/button";
import { Settings } from "@prisma/client";

interface CheckoutClientProps {
  settings: Settings | null;
  currentUser: any;
}

const CheckoutClient: React.FC<CheckoutClientProps> = ({ settings, currentUser }) => {
  const router = useRouter();
  const { cartProducts, paymentIntent, handleSetPaymentIntent, handleClearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const spf = (settings as any)?.spf || 100;



  const handleSetPaymentSuccess = useCallback(
    async (value: boolean, deliveryInfo?: { name: string; phone: string; address: string; hostel?: string; email?: string }) => {
      setPaymentSuccess(value);
      if (value && deliveryInfo) {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: cartProducts,
              address: deliveryInfo,
              guestEmail: deliveryInfo.email,
              guestName: deliveryInfo.name,
            }),
          });
          const data = await res.json();
          setLoading(false);
          if (!res.ok || !data?.orderId) {
            const message = data?.error || "Order creation failed.";
            setError(message);
            toast.error(message);
            return;
          }
          setOrderId(data.orderId);
          if (data.guestToken) setGuestToken(data.guestToken);
          handleSetPaymentIntent(data.orderId);
          // Show success notification with payment instructions
          toast.success(
            (t) => (
              <div className="text-sm">
                <p className="font-semibold mb-2">Order placed successfully!</p>
                <p className="mb-2">Kindly pay to the account details provided.</p>
                <p className="mb-2">Then tick <em>I have paid</em> on your order when done.</p>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="mt-3 px-3 py-1 bg-white text-teal-600 rounded font-medium text-xs"
                >
                  Dismiss
                </button>
              </div>
            ),
            { duration: 8000 }
          );
          handleClearCart();
          handleSetPaymentIntent(null);
        } catch (error: any) {
          setLoading(false);
          setError(error?.message || "Order creation failed.");
          toast.error(error?.message || "Order creation failed.");
        }
      }
    },
    [cartProducts, handleClearCart, handleSetPaymentIntent]
  );

  return (
    <div className="w-full">
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin text-blue-500 mr-2" size={28} />
          <span className="text-blue-500 text-base">Loading Checkout...</span>
        </div>
      )}
      {error && (
        <div className="text-center text-rose-500">Something went wrong...</div>
      )}
      {paymentSuccess && (
        <div className="flex items-center flex-col gap-4">
          <div className="text-teal-500 text-center">Order Placed Successfully</div>
          <div className="max-w-[220px] w-full">
            <Button
              label={loading ? "Loading..." : `View Your Order`}
              onClick={() => {
                if (loading || !orderId) return;
                const url = guestToken 
                  ? `/order/${orderId}?token=${guestToken}` 
                  : `/order/${orderId}`;
                router.push(url);
              }}
              disabled={loading || !orderId}
            />
          </div>
        </div>
      )}
      {cartProducts && (
        <CheckoutForm
          handleSetPaymentSuccess={handleSetPaymentSuccess}
          spf={spf}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default CheckoutClient;
