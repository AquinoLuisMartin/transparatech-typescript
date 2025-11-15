export default function ContactInformation() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Contact Information
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get in touch for transparency-related inquiries
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Email Contact */}
          <div className="text-center p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-light-50 rounded-xl mx-auto mb-4 dark:bg-blue-light-500/15">
              <svg
                className="text-blue-light-500 size-6 dark:text-blue-light-400"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="L22 6L12 13L2 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h4 className="font-medium text-gray-800 dark:text-white/90 mb-2">
              Email Support
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              transparency@organization.gov
            </p>
          </div>

          {/* Phone Contact */}
          <div className="text-center p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-center w-12 h-12 bg-success-50 rounded-xl mx-auto mb-4 dark:bg-success-500/15">
              <svg
                className="text-success-500 size-6 dark:text-success-400"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.271 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h4 className="font-medium text-gray-800 dark:text-white/90 mb-2">
              Phone Support
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              +1 (555) 123-4567
            </p>
          </div>

          {/* Office Hours */}
          <div className="text-center p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-center w-12 h-12 bg-warning-50 rounded-xl mx-auto mb-4 dark:bg-warning-500/15">
              <svg
                className="text-warning-500 size-6 dark:text-warning-400"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 6V12L16 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h4 className="font-medium text-gray-800 dark:text-white/90 mb-2">
              Office Hours
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mon-Fri: 9AM-5PM EST
            </p>
          </div>

          {/* Location */}
          <div className="text-center p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-center w-12 h-12 bg-error-50 rounded-xl mx-auto mb-4 dark:bg-error-500/15">
              <svg
                className="text-error-500 size-6 dark:text-error-400"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3640 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h4 className="font-medium text-gray-800 dark:text-white/90 mb-2">
              Office Location
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              123 Government St, DC
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <h4 className="font-medium text-gray-800 dark:text-white/90 mb-3">
            Frequently Asked Questions
          </h4>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                How long does it take to process data requests?
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Most requests are processed within 5-10 business days.
              </p>
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                What types of information are publicly available?
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Financial reports, policy documents, meeting minutes, and statistical data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}