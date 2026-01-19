import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// IMPORTANT: match the component name + file name exactly
import MoneyBubbles from "../components/moneyBubbles";

// Apps Script Web App endpoint
const API_URL =
  "https://script.google.com/macros/s/AKfycbwPzwgAOjV_4H3xznz0ebd8ZvhyGrvCc8AcLXz_ZL-I/exec";

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
        metadata: {
          source: "web_app",
          format: "text",
        },
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Request failed: ${response.status} ${text}`);
      }

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
        <Card className="shadow-xl border-slate-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-slate-800">Send Message</CardTitle>
            <CardDescription>Enter your text below to dispatch it to the API.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[150px] resize-none text-base p-4 focus-visible:ring-indigo-500"
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleSendClick}
              disabled={isSending || !message.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all h-11 text-base font-medium"
            >
              {isSending ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  Sending...
                </motion.div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              Are you sure?
            </DialogTitle>
            <DialogDescription className="pt-2 text-base">
              This action will format your message and send it to the external server.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 mt-4 sm:space-x-0">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="bg-indigo-600 hover:bg-indigo-700">
              Yes, send it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
