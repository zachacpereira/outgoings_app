import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MoneyBubbles from '../components/MoneyBubbles';

// Placeholder URL - User needs to replace this
const API_URL = "https://api.example.com/send-message";

export default function Home() {
  const [message, setMessage] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSendClick = () => {
    if (!message.trim()) {
      // toast.error("Please enter a message first");
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setIsConfirmOpen(false);
    setIsSending(true);

    try {
      // Format the data
      const payload = {
        timestamp: new Date().toISOString(),
        content: message.trim(),
        metadata: {
          source: "web_app",
          format: "text"
        }
      };

      console.log("Sending payload:", payload);

      // Simulate API call since we don't have a real backend URL yet
      // Replace this setTimeout with actual fetch when URL is provided:
      /*
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Network response was not ok');
      */
      
      // Artificial delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success sequence
      setIsSending(false);
      setMessage("");
      setShowAnimation(true);
      // toast.success("Message sent successfully!");

    } catch (error) {
      console.error("Error sending message:", error);
      setIsSending(false);
      // toast.error("Failed to send message. Please try again.");
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
            <CardDescription>
              Enter your text below to dispatch it to the API.
            </CardDescription>
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
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
