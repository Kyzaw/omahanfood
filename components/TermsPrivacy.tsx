"use client";

import Image from "next/image";
import { useState } from "react";

export function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.jpg"
                alt="Omahan Food Logo"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <h1 className="text-xl font-bold text-gray-900">Omahan Food</h1>
            </div>
            <a
              href="/login"
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Back to Login
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 sm:px-8 py-8 sm:py-12 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto">
              Please read these terms carefully before using Omahan Food services
            </p>
            <p className="text-orange-200 text-sm mt-4">
              Last updated: September 2025
            </p>
          </div>

          {/* Terms Content */}
          <div className="px-6 sm:px-8 py-8 sm:py-12">
            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By accessing and using Omahan Food services, you accept and agree to be bound by the terms
                  and provision of this agreement. If you do not agree to abide by the above, please do not
                  use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Omahan Food is a digital platform that connects customers with restaurants and food vendors.
                  We provide food ordering, delivery coordination, and payment processing services.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Online food ordering and delivery</li>
                  <li>Restaurant discovery and reviews</li>
                  <li>Payment processing and order tracking</li>
                  <li>Customer support services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Account</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To use our services, you must create an account and provide accurate information.
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-4">
                  <p className="text-orange-800 font-medium">
                    Important: You must be at least 18 years old to create an account and use our services.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Orders and Payment</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All orders are subject to acceptance by the restaurant. Prices are as displayed at the time
                  of ordering. Payment must be made in full before order processing.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancellation Policy:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Orders can be cancelled within 5 minutes of placement</li>
                  <li>Refunds will be processed within 3-5 business days</li>
                  <li>No cancellation allowed once food preparation begins</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Delivery Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Delivery times are estimates and may vary due to weather, traffic, or high demand.
                  Omahan Food is not responsible for delays beyond our control.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Uses</h2>
                <p className="text-gray-700 leading-relaxed mb-4">You may not use our service:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To transmit or procure the sending of any advertising or promotional material without our prior written consent</li>
                  <li>To impersonate or attempt to impersonate another user, person, or entity</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Omahan Food shall not be liable for any indirect, incidental, special, consequential, or
                  punitive damages resulting from your use of the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We reserve the right to modify these terms at any time. Users will be notified of any
                  material changes via email or platform notification.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700"><strong>Email:</strong> legal@omahanfood.com</p>
                  <p className="text-gray-700"><strong>Phone:</strong> +62-xxx-xxxx-xxxx</p>
                  <p className="text-gray-700"><strong>Address:</strong> Bogor, West Java, Indonesia</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Privacy Policy Page
export function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.jpg"
                alt="Omahan Food Logo"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <h1 className="text-xl font-bold text-gray-900">Omahan Food</h1>
            </div>
            <a
              href="/login"
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Back to Login
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 sm:px-8 py-8 sm:py-12 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-orange-200 text-sm mt-4">
              Last updated: September 2025
            </p>
          </div>

          {/* Privacy Content */}
          <div className="px-6 sm:px-8 py-8 sm:py-12">
            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect information you provide directly to us, information we obtain automatically
                  when you use our services, and information from third parties.
                </p>

                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Personal Information:</h3>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li>Name, email address, phone number</li>
                      <li>Delivery addresses and payment information</li>
                      <li>Order history and preferences</li>
                      <li>Profile photos and reviews</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Automatically Collected:</h3>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li>Device information and IP address</li>
                      <li>Location data (with permission)</li>
                      <li>Usage patterns and preferences</li>
                      <li>Cookies and similar technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the information we collect to provide, maintain, and improve our services:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Processing and fulfilling your orders</li>
                  <li>Communicating with you about orders and services</li>
                  <li>Personalizing your experience and recommendations</li>
                  <li>Preventing fraud and ensuring security</li>
                  <li>Improving our platform and customer service</li>
                  <li>Marketing and promotional communications (with consent)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may share your information in the following circumstances:
                </p>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <button
                      onClick={() => toggleSection('restaurants')}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="font-semibold text-gray-900">With Restaurants & Delivery Partners</h3>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${activeSection === 'restaurants' ? 'rotate-180' : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeSection === 'restaurants' && (
                      <div className="mt-3 text-gray-700 text-sm">
                        We share order details, delivery addresses, and contact information necessary
                        to fulfill your orders with our restaurant and delivery partners.
                      </div>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <button
                      onClick={() => toggleSection('service')}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="font-semibold text-gray-900">Service Providers</h3>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${activeSection === 'service' ? 'rotate-180' : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeSection === 'service' && (
                      <div className="mt-3 text-gray-700 text-sm">
                        We work with third-party service providers for payment processing, analytics,
                        customer support, and marketing services.
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Security Measures:</h3>
                  <ul className="list-disc list-inside text-green-700 text-sm space-y-1">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure payment processing with PCI compliance</li>
                    <li>Regular security audits and monitoring</li>
                    <li>Access controls and employee training</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights and Choices</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have several rights regarding your personal information:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Access & Update</h3>
                    <p className="text-purple-700 text-sm">
                      View and update your account information at any time through your profile settings.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Data Portability</h3>
                    <p className="text-purple-700 text-sm">
                      Request a copy of your personal data in a structured, commonly used format.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Deletion</h3>
                    <p className="text-purple-700 text-sm">
                      Request deletion of your account and associated personal information.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Marketing Opt-out</h3>
                    <p className="text-purple-700 text-sm">
                      Unsubscribe from marketing communications at any time.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your experience, analyze usage,
                  and provide personalized content. You can manage your cookie preferences in your browser settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children&apos;s Privacy</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    Our services are not intended for children under 18 years of age. We do not knowingly
                    collect personal information from children under 18.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-700 font-medium mb-2">General Inquiries:</p>
                      <p className="text-gray-700 text-sm">privacy@omahanfood.com</p>
                      <p className="text-gray-700 text-sm">+62-xxx-xxxx-xxxx</p>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium mb-2">Data Protection Officer:</p>
                      <p className="text-gray-700 text-sm">dpo@omahanfood.com</p>
                      <p className="text-gray-700 text-sm">Bogor, West Java, Indonesia</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}