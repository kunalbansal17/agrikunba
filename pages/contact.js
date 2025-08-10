import Navbar from "../components/navbar";
import Footer from "../components/footer";


import { useState } from "react";
import Head from "next/head";

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const PHONE_RE = /^\+?[0-9]{7,15}$/; // optional +, 7–15 digits

export default function Contact() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = (v) => {
    const e = {};
    if (!v.name?.trim()) e.name = "Full name is required.";
    if (!v.email?.trim()) e.email = "Email is required.";
    else if (!EMAIL_RE.test(v.email)) e.email = "Please enter a valid email address.";
    if (!v.phone?.trim()) e.phone = "Phone number is required.";
    else if (!PHONE_RE.test(v.phone)) e.phone = "Enter 7–15 digits, with optional country code.";
    if (!v.message?.trim()) e.message = "Message is required.";
    return e;
  };

  const showError = (field) => {
    // Only show error if the field has been touched (blurred) OR user already tried to submit
    return (touched[field] || attemptedSubmit) && errors[field];
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);

    // live-validate only if user has already tried submitting or touched this field
    if (attemptedSubmit || touched[name]) {
      setErrors(validate(next));
    }
  };

  const onBlur = (e) => {
    const { name } = e.target;
    const nextTouched = { ...touched, [name]: true };
    setTouched(nextTouched);
    setErrors(validate(values));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    const finalErrors = validate(values);
    setErrors(finalErrors);
    if (Object.keys(finalErrors).length > 0) return; // show errors, don't submit

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", values.name);
      data.append("email", values.email);
      data.append("phone", values.phone);
      data.append("message", values.message);

      const res = await fetch("https://formspree.io/f/mgvzpqbq", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setSubmitted(true);
        setValues({ name: "", email: "", phone: "", message: "" });
        setTouched({});
        setAttemptedSubmit(false);
        setErrors({});
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setErrors({ submit: "Something went wrong. Please try again." });
      }
    } catch {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">{
    <div className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
      <Head>
        <title>Contact Us | AgriKunba</title>
      </Head>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-center text-green-700">Contact Us</h1>
        <p className="mt-4 text-center text-gray-800">
          We&rsquo;d love to hear from you. Fill out the form below and we&rsquo;ll be in touch shortly.
        </p>

        {submitted && (
          <div className="mt-6 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded relative">
            <strong className="font-semibold">Thank you!</strong>
            <span className="block sm:inline ml-2">Your message has been sent successfully.</span>
            <button
              type="button"
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={() => setSubmitted(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}

        {errors.submit && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-black">Full Name</label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={onChange}
              onBlur={onBlur}
              required
              minLength={2}
              placeholder="Enter your full name"
              className={`mt-1 block w-full p-3 border rounded-md shadow-sm text-black ${
                showError("name") ? "border-red-500" : "border-gray-400"
              }`}
              aria-invalid={!!showError("name")}
            />
            {showError("name") && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black">Email Address</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={onChange}
              onBlur={onBlur}
              required
              placeholder="you@example.com"
              className={`mt-1 block w-full p-3 border rounded-md shadow-sm text-black ${
                showError("email") ? "border-red-500" : "border-gray-400"
              }`}
              aria-invalid={!!showError("email")}
            />
            {showError("email") && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-black">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={values.phone}
              onChange={onChange}
              onBlur={onBlur}
              required
              placeholder="Include country code (e.g., +91 9876543210)"
              className={`mt-1 block w-full p-3 border rounded-md shadow-sm text-black ${
                showError("phone") ? "border-red-500" : "border-gray-400"
              }`}
              aria-invalid={!!showError("phone")}
            />
            {showError("phone") && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-black">Message</label>
            <textarea
              name="message"
              value={values.message}
              onChange={onChange}
              onBlur={onBlur}
              rows="4"
              required
              placeholder="Write your message here..."
              className={`mt-1 block w-full p-3 border rounded-md shadow-sm text-black ${
                showError("message") ? "border-red-500" : "border-gray-400"
              }`}
              aria-invalid={!!showError("message")}
            />
            {showError("message") && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full font-semibold py-3 px-6 rounded-md transition ${
                submitting
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-green-700 text-white hover:bg-green-800 cursor-pointer"
              }`}
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
}</main>
  );
}
