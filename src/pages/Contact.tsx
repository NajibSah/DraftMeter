import React, { useState } from "react";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-stone-50 min-h-screen py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-6">Get in Touch</h1>
          <p className="text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
            Have questions about our maturity algorithm or suggestions for the editor? We'd love to hear from you.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-stone-200">
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-stone-50 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-stone-900" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Email Us</h3>
                  <p className="text-sm text-stone-500">support@draftmeter.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-stone-200">
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-stone-50 rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-stone-900" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Feedback</h3>
                  <p className="text-sm text-stone-500">Submit feature requests via our portal.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-stone-200">
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-stone-50 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-stone-900" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Office</h3>
                  <p className="text-sm text-stone-500">Digital Nomad HQ, Cloud City</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-stone-200 shadow-sm relative overflow-hidden">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <Send className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                  <p className="text-stone-500 max-w-xs">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Jane Doe" 
                        className="w-full bg-stone-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-stone-900 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="jane@example.com" 
                        className="w-full bg-stone-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-stone-900 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Subject</label>
                    <input 
                      required
                      type="text" 
                      placeholder="How can we help?" 
                      className="w-full bg-stone-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-stone-900 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-1">Message</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Your message details..." 
                      className="w-full bg-stone-50 border-none rounded-2xl p-4 text-sm resize-none focus:ring-2 focus:ring-stone-900 transition-all outline-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-stone-900 text-white rounded-2xl py-5 font-bold transition-all hover:bg-stone-800 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Send Message
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
