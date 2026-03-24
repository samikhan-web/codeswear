import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const Success = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session_id) return;

    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/orders/myorders`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();

        if (res.ok) {
          const order = data.orders.find((o) => o.stripeSessionId === session_id);
          if (order) {
            toast.success("Payment successful! Your order is confirmed.");
            router.push(`/orders/${order._id}`);
          } else {
            toast.error("Order not found");
            router.push("/checkout");
          }
        } else {
          toast.error(data.message || "Something went wrong");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      }
      setLoading(false);
    };

    verifyPayment();
  }, [session_id]);

  if (loading) return <div className="p-8 text-center">Verifying payment...</div>;

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold">Thank you for your payment!</h2>
      <p className="mt-2">Redirecting you to your order details...</p>
    </div>
  );
};

export default Success;
