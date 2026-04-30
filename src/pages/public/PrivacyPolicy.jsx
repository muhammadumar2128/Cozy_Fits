import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-32 sm:pt-48 pb-20 sm:pb-32 px-6 bg-silk">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl font-bold mb-12 text-dark-slate uppercase tracking-tighter">
            Privacy <span className="italic font-normal text-accent-gold">Policy</span>
          </h1>

          <div className="space-y-12 text-slate-600 leading-relaxed font-light">
            <section>
              <h2 className="text-xl font-bold text-dark-slate mb-4 uppercase tracking-widest">Introduction</h2>
              <p>
                At Cozy Fits.pk, we are committed to protecting the privacy and security of our customers, especially when it comes to the safety of information related to children. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website and purchase our handcrafted children's apparel.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark-slate mb-4 uppercase tracking-widest">Information We Collect</h2>
              <p>
                We collect information necessary to process your orders and provide a personalized shopping experience. This includes:
              </p>
              <ul className="list-disc ml-6 mt-4 space-y-2">
                <li>Contact details (name, email address, phone number)</li>
                <li>Shipping and billing addresses</li>
                <li>Order history and preferences</li>
                <li>Device information and browsing behavior via cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark-slate mb-4 uppercase tracking-widest">Children's Privacy</h2>
              <p>
                Our products are designed for children, but our services are intended for use by adults. We do not knowingly collect personal information directly from children under the age of 13. All purchases must be made by an adult. We encourage parents to supervise their children's online activities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark-slate mb-4 uppercase tracking-widest">How We Use Your Information</h2>
              <p>
                Your information is used to:
              </p>
              <ul className="list-disc ml-6 mt-4 space-y-2">
                <li>Process and deliver your orders</li>
                <li>Communicate order updates and customer support</li>
                <li>Send promotional offers (only if you opt-in)</li>
                <li>Improve our website and shopping experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark-slate mb-4 uppercase tracking-widest">Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data. Your payment information is processed through secure gateways, and we do not store sensitive bank details on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark-slate mb-4 uppercase tracking-widest">Contact Us</h2>
              <p>
                If you have any questions regarding this Privacy Policy, please contact us at support@cozyfits.pk.
              </p>
            </section>

            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase pt-12">
              Last Updated: April 2026
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
