// pages/resetpassword/[token].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // optional: you could check token format client-side (length) before showing form
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => router.push("/login"), 1800);
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-pink-600 text-center">Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="New Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border p-2 rounded-lg" required />
          <input type="password" placeholder="Confirm Password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="w-full border p-2 rounded-lg" required />
          <button type="submit" disabled={loading} className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
