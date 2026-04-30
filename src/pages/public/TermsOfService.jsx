import React from 'react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-32 sm:pt-48 pb-20 sm:pb-32 px-6 bg-silk">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl font-bold mb-12 text-dark-slate uppercase tracking-tighter">
            Terms of <span className="italic font-normal text-accent-gold">Service</span>
          </h1>

          <div className="space-y-12 text-slate-600 leading-relaxed font-light">
            <section>
              <h2 className="text-xl font-bold text-dark-slate mb-4 uppercase tracking-widest">Agreement to Terms</h2>
              <p>
                By accessing or using Cozy Fits.pk, you agree to be bound by these Terms of Service. Our store offers premium, handcrafted children's clothing, and these terms govern your purchase and use of our products.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark-slate mb-4 uppercase tracking-widest">Product Information</h2>
              <p>
                We strive for accuracy in our product descriptions and photography. However, since our pieces are handcrafted and use natural materials like 100% organic silk, slight variations in color and texture may occur. These are not defects but a testament to the unique nature of our couture.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark-slate mb-4 uppercase tracking-widest">Orders and Payment</h2>
              <p>
                Orders are subject to acceptance and availability. We currently process payments via Bank Transfer. Your order is only confirmed once the payment receipt has been verified by our team. Prices are listed in PKR and include all applicable taxes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark-slate mb-4 uppercase tracking-widest">Shipping and Delivery</h2>
              <p>
                We offer shipping all over Pakistan. Delivery times vary based on location. We are not responsible for delays caused by third-party shipping carriers, but we will assist in tracking your "treasures" until they arrive.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark-slate mb-4 uppercase tracking-widest">Returns and Exchanges</h2>
              <p>
                Due to the delicate and artisanal nature of our children's apparel, we handle returns on a case-by-case basis. If you receive a damaged or incorrect item, please contact us within 48 hours of delivery with photographic evidence.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark-slate mb-4 uppercase tracking-widest">Safety Warning</h2>
              <p>
                While we use the highest quality organic materials, parents should always inspect clothing for loose threads or small decorative elements before dressing their children. Use of our products is at the discretion and responsibility of the parent or guardian.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-dark-slate mb-4 uppercase tracking-widest">Intellectual Property</h2>
              <p>
                All designs, images, and content on this website are the intellectual property of Cozy Fits.pk. Reproduction or use without explicit permission is strictly prohibited.
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

export default TermsOfService;
