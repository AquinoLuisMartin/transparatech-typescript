import React from 'react';
import PageMeta from '../../../components/common/PageMeta';

const FeedbackViewer: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    anonymous: false
  });

  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const categories = [
    'General Feedback',
    'Website Usability',
    'Information Request',
    'Technical Issue',
    'Suggestion for Improvement',
    'Complaint',
    'Compliment',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Feedback submitted:', formData);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: '',
      anonymous: false
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <>
        <PageMeta 
          title="Feedback Submitted | PUPSMB TransparaTech" 
          description="Thank you for your feedback submission to PUPSMB TransparaTech"
        />
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                Feedback Submitted Successfully!
              </h1>
              <p className="text-green-800 dark:text-green-200 mb-6">
                Thank you for taking the time to share your feedback with us. Your input is valuable and helps us improve our services.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Another Feedback
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-3 border border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors"
                >
                  Go Back
                </button>
              </div>
              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What happens next?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We typically respond to feedback within 3-5 business days. If your feedback requires immediate attention, 
                  you will hear from us within 24 hours. Thank you for helping us improve!
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta 
        title="Feedback & Suggestions | PUPSMB TransparaTech" 
        description="Share your feedback and suggestions to help improve PUPSMB TransparaTech services"
      />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Feedback & Suggestions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your voice matters! Help us improve our transparency portal and services
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Feedback Form (full width) */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Share Your Feedback
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Anonymous Option */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      name="anonymous"
                      checked={formData.anonymous}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Submit anonymously (your contact details will not be recorded)
                    </label>
                  </div>

                  {/* Contact Information */}
                  {!formData.anonymous && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required={!formData.anonymous}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required={!formData.anonymous}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Feedback Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Brief description of your feedback"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Please provide detailed feedback or suggestions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </form>
              </div>

              {/* Two-column grid: Response Time + Feedback Guidelines */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">Response Time</h3>
                  <ul className="list-none text-sm space-y-2 text-green-800 dark:text-green-200">
                    <li className="flex items-start"><span className="mr-2 text-lg leading-none">•</span><span><strong>General Feedback:</strong> 3–5 business days</span></li>
                    <li className="flex items-start"><span className="mr-2 text-lg leading-none">•</span><span><strong>Technical Issues:</strong> 1–2 business days</span></li>
                    <li className="flex items-start"><span className="mr-2 text-lg leading-none">•</span><span><strong>Urgent Matters:</strong> Within 24 hours</span></li>
                  </ul>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Feedback Guidelines</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-yellow-800 dark:text-yellow-200 list-none">
                    <li className="flex items-start"><span className="mr-2 text-lg leading-none">•</span><span>Be specific and constructive</span></li>
                    <li className="flex items-start"><span className="mr-2 text-lg leading-none">•</span><span>One topic per submission</span></li>
                    <li className="flex items-start"><span className="mr-2 text-lg leading-none">•</span><span>Include relevant details</span></li>
                    <li className="flex items-start"><span className="mr-2 text-lg leading-none">•</span><span>Check FAQ before submitting</span></li>
                    <li className="flex items-start sm:col-span-2"><span className="mr-2 text-lg leading-none">•</span><span>Maintain respectful communication</span></li>
                  </ul>
                </div>
              </div>

              {/* Privacy Notice (full width) */}
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Privacy & Data Protection
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your feedback is confidential and will only be used to improve our services. 
                  We do not share personal information with third parties. You can submit feedback 
                  anonymously if preferred.
                </p>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackViewer;