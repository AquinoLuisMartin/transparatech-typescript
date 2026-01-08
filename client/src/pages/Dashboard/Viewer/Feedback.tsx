import React, { useState } from "react";
import axios from "axios";
import PageMeta from "../../../components/common/PageMeta";
import Input from "../../../components/form/input/InputField";

const Feedback: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/v1/feedback", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSubmitMessage({
          type: "success",
          text: "Thank you for your feedback! We'll review it shortly.",
        });
        setFormData({
          name: "",
          email: "",
          category: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Failed to submit feedback", error);
      setSubmitMessage({
        type: "error",
        text: "Failed to submit feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Feedback"
        description="Send feedback and suggestions"
      />

      <div className="mb-6">
        <h1 className="text-title-md font-bold text-gray-800 dark:text-white/90">
          Feedback
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Share your thoughts, suggestions, or report issues
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="complaint">Complaint</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <Input
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief subject"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Enter your detailed feedback..."
              required
            />
          </div>

          {submitMessage && (
            <div
              className={`p-4 rounded-xl ${
                submitMessage.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                  : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Feedback;
