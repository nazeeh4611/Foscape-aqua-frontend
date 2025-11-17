import axios from "axios";
import React, { useState, useEffect } from "react";
import { baseurl } from "../../Base/Base";
import { toast } from "react-toastify";
import { X, ArrowRight, Lock } from "lucide-react";

const OtpModal = ({ show, onClose, email, onVerifySuccess }) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeLeft(300);
      setCanResend(false);
      setOtp("");
    }
  }, [show]);

  useEffect(() => {
    if (!show) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show]);

  if (!show) return null;

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${baseurl}user/verify-otp`,
        { email, otp }
      );

      if (res.data.success) {
        toast.success("Email verified successfully!");
        localStorage.setItem("token", res.data.token);
        if (res.data.user) {
          localStorage.setItem("userData", JSON.stringify(res.data.user));
        }
        setOtp("");
        onClose();
        
        if (onVerifySuccess) {
          onVerifySuccess();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(
        `${baseurl}user/resend-otp`,
        { email }
      );
      toast.success("OTP resent successfully");
      setTimeLeft(300);
      setCanResend(false);
      setOtp("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20, 78, 140, 0.15)", backdropFilter: "blur(8px)" }}
    >
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-8" style={{ background: "linear-gradient(135deg, #144E8C 0%, #78C7A2 100%)" }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all hover:rotate-90"
          style={{ background: "rgba(255, 255, 255, 0.2)" }}
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: "rgba(255, 255, 255, 0.15)" }}>
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Verify Email</h3>
          <p className="text-sm mt-2 text-white opacity-80">
            We sent a code to {email}
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength="6"
              className="w-full px-4 py-3 rounded-xl text-center text-2xl font-bold border-0 focus:outline-none focus:ring-2 tracking-widest placeholder-white/50"
              style={{ background: "rgba(255, 255, 255, 0.15)", color: "#fff" }}
              placeholder="000000"
              required
            />
          </div>

          <div className="text-center">
            <p className="text-sm text-white opacity-80">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="text-white font-semibold hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              ) : (
                <>Resend in {formatTime(timeLeft)}</>
              )}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "rgba(255, 255, 255, 0.25)", backdropFilter: "blur(10px)" }}
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs mt-6 text-white opacity-60">
          Didn't receive the code? Check your spam folder
        </p>
      </div>
    </div>
  );
};

export default OtpModal;