"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";

interface CampusAmbassadorEnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CampusAmbassadorEnrollModal({
  isOpen,
  onClose,
}: CampusAmbassadorEnrollModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    branch: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/campus-ambassador/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to enroll. Please try again.");
      }

      setReferralCode(data.referralCode);
      setStatus("success");
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  };

  const handleClose = () => {
    if (status === "success") {
      setFormData({ name: "", contact: "", branch: "" });
      setStatus("idle");
      setReferralCode("");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-base-950 border border-base-800 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto relative"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-ink-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-6 sm:p-8">
                {status === "success" ? (
                  <div className="text-center py-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle2 size={32} />
                    </motion.div>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">
                      Welcome Aboard!
                    </h3>
                    <p className="text-ink-300 mb-6 text-sm">
                      You are now a Campus Ambassador. Here is your unique referral code. Share it with your peers!
                    </p>
                    <div className="bg-base-900 border border-base-800 rounded-xl p-4 mb-6">
                      <p className="text-xs text-ink-400 uppercase tracking-wider font-semibold mb-1">
                        Your Referral Code
                      </p>
                      <p className="text-3xl font-mono font-bold text-white tracking-widest">
                        {referralCode}
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-full bg-white text-base-950 hover:bg-ink-0 transition-colors py-3 rounded-lg font-semibold"
                    >
                      Awesome, got it!
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-display font-bold text-white mb-2">
                      Enroll as Ambassador
                    </h2>
                    <p className="text-ink-300 text-sm mb-6">
                      Join the program and get a unique referral code to invite your peers.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-ink-300 mb-1">
                          Full Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-base-900 border border-base-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg px-4 py-2.5 text-white outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="branch" className="block text-sm font-medium text-ink-300 mb-1">
                          Branch
                        </label>
                        <input
                          id="branch"
                          type="text"
                          required
                          value={formData.branch}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                          className="w-full bg-base-900 border border-base-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg px-4 py-2.5 text-white outline-none transition-all"
                          placeholder="Computer Science"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-ink-300 mb-1">
                          Contact Number
                        </label>
                        <input
                          id="contact"
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          title="Please enter a valid 10-digit phone number"
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          className="w-full bg-base-900 border border-base-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg px-4 py-2.5 text-white outline-none transition-all"
                          placeholder="9876543210"
                        />
                      </div>

                      {status === "error" && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-white text-base-950 hover:bg-ink-0 transition-colors py-3 rounded-lg font-semibold flex items-center justify-center mt-6 disabled:opacity-70"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 size={18} className="animate-spin mr-2" />
                            Enrolling...
                          </>
                        ) : (
                          "Generate Referral Code"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}