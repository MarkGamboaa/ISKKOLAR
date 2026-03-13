import { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import SuccessModal from "../../components/common/SuccessModal";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setShowSuccess(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our scholarship programs? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-background rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">123 Foundation St., Quezon City, Metro Manila, Philippines</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">info@kkfi.org</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">+63 2 8888 1234</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Office Hours</h3>
              <p className="text-blue-100 text-sm mb-4">
                Visit us during office hours for walk-in inquiries.
              </p>
              <div className="space-y-1 text-sm">
                <p><span className="text-blue-200">Monday – Friday:</span> 8:00 AM – 5:00 PM</p>
                <p><span className="text-blue-200">Saturday – Sunday:</span> Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit}>
              <Input
                label="Full Name"
                name="contact-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onBlur={() => { if (!form.name.trim()) setErrors(prev => ({ ...prev, name: "Name is required" })); else setErrors(prev => { const { name, ...rest } = prev; return rest; }); }}
                error={errors.name}
                placeholder="Enter your full name"
                required
              />
              <Input
                label="Email Address"
                name="contact-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={() => { if (!form.email.trim()) setErrors(prev => ({ ...prev, email: "Email is required" })); else if (!/\S+@\S+\.\S+/.test(form.email)) setErrors(prev => ({ ...prev, email: "Invalid email format" })); else setErrors(prev => { const { email, ...rest } = prev; return rest; }); }}
                error={errors.email}
                placeholder="Enter your email"
                required
              />
              <div className="mb-4">
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message <span className="text-danger">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onBlur={() => { if (!form.message.trim()) setErrors(prev => ({ ...prev, message: "Message is required" })); else setErrors(prev => { const { message, ...rest } = prev; return rest; }); }}
                  placeholder="Write your message here..."
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                    errors.message ? "border-danger focus:ring-danger/30" : "border-gray-300 focus:ring-primary/30 focus:border-primary"
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-danger flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.message}
                  </p>
                )}
              </div>
              <Button type="submit" loading={loading} fullWidth size="lg">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Message Sent!"
        message="Thank you for reaching out. We'll get back to you as soon as possible."
      />
    </section>
  );
};

export default ContactSection;
