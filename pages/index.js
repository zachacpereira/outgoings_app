import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, AlertCircle } from "lucide-react";

// ✅ Fix: your file is components/MoneyBubbles.js (case-sensitive on Vercel)
import MoneyBubbles from "../components/MoneyBubbles";

const API_URL =
"https://script.google.com/macros/s/AKfycbw3bwloq5fmkELLQdTtH9mKZ7u6YvaUNMUccC0pvstngiSco0nB_otpBYRbIEbDx26Uxw/exec";

export default function Home() {
  const [message, setMessage] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSendClick = () => {
    if (!message.trim()) return;
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setIsConfirmOpen(false);
    setIsSending(true);

    try {
      const payload = {
        timestamp: new Date().toISOString(),
        content: message.trim(),
        metadata: { source: "web_app", format: "text" },
      };

      const response = await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
        redirect: "follow"
      });

      // With no-cors, we can't read the response, so just assume success
      setIsSending(false);
      setMessage("");
      setShowAnimation(true);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsSending(false);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <MoneyBubbles active={showAnimation} onComplete={() => setShowAnimation(false)} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="shadow-xl border border-slate-200 bg-white/80 backdrop-blur-sm rounded-xl">
          <div className="p-6 space-y-1">
            <div className="text-2xl font-bold text-slate-800">Send Message</div>
            <div className="text-slate-600">
              Enter your text below to dispatch it to the API.
            </div>
          </div>

          <div className="px-6 pb-6 space-y-4">
            <textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full min-h-[150px] resize-none text-base p-4 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={handleSendClick}
              disabled={isSending || !message.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-all h-11 text-base font-medium rounded-md flex items-center justify-center gap-2"
            >
              {isSending ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  Sending...
                </motion.div>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Message
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200">
            <div className="p-6">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <AlertCircle className="w-5 h-5 text-indigo-600" />
                Are you sure?
              </div>
              <div className="pt-2 text-base text-slate-600">
                This action will format your message and send it to the external server.
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-2 justify-end">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="h-10 px-4 rounded-md border border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="h-10 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Yes, send it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
