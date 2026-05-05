import { Mail, MessageSquare, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-stone-50 min-h-screen py-24 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">Get in Touch</h1>
        <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-16 leading-relaxed">
          Have questions about our maturity algorithm or suggestions for the editor? We'd love to hear from you.
        </p>

        <div className="grid gap-8 md:grid-cols-3 text-left">
          <div className="bg-white p-10 rounded-[3rem] border border-stone-200">
            <div className="h-12 w-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-stone-900" />
            </div>
            <h3 className="font-bold mb-2">Email Us</h3>
            <p className="text-sm text-stone-500">support@draftmeter.com</p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-stone-200">
            <div className="h-12 w-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6 text-stone-900" />
            </div>
            <h3 className="font-bold mb-2">Feedback</h3>
            <p className="text-sm text-stone-500">Submit a feature request via our portal.</p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-stone-200">
            <div className="h-12 w-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-stone-900" />
            </div>
            <h3 className="font-bold mb-2">Office</h3>
            <p className="text-sm text-stone-500">Digital Nomad HQ, Cloud City</p>
          </div>
        </div>

      </div>
    </div>
  );
}
