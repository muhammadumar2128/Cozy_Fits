import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-silk pt-48 pb-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-32"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="h-[1px] w-8 bg-accent-gold" />
            <span className="text-[10px] font-bold tracking-[0.6em] text-accent-gold uppercase">Heritage</span>
            <div className="h-[1px] w-8 bg-accent-gold" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-dark-slate mb-8">The Heart of <br /> <span className="italic font-normal text-accent-gold">Cozy_Fits.</span></h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-light leading-relaxed">
            Where every stitch tells a story of tradition, and every fabric carries the whisper of luxury. We don't just dress children; we drape the next generation in elegance.
          </p>
        </motion.div>

        {/* Narrative Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-40">
          <motion.div {...fadeUp} className="relative aspect-[3/4] rounded-[4rem] overflow-hidden shadow-2xl bg-neutral-soft">
            <img 
              src="/images/our story image.png" 
              className="w-full h-full object-cover" 
              alt="Cozy Fits Heritage" 
            />
          </motion.div>
          <motion.div {...fadeUp} className="space-y-8">
            <h2 className="text-4xl font-bold text-dark-slate">Born from <span className="italic font-normal text-accent-gold">Tradition.</span></h2>
            <p className="text-slate-500 leading-relaxed font-light text-sm">
              Founded in 2026, Cozy Fits.pk was born from a simple yet profound vision: to bring the richness of Pakistani craftsmanship to the global stage of children's fashion. Our journey began in a small workshop where the hum of machines was second only to the passion of our artisans.
            </p>
            <p className="text-slate-500 leading-relaxed font-light text-sm">
              We believe that childhood is the most precious canvas. Our designs reflect that purity, combining the strength of heritage with the softness of 100% organic silk.
            </p>
          </motion.div>
        </div>

        {/* Narrative Section 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-40">
          <motion.div {...fadeUp} className="order-2 md:order-1 space-y-8 text-right">
            <h2 className="text-4xl font-bold text-dark-slate">Silk, Love & <span className="italic font-normal text-accent-gold">Labor.</span></h2>
            <p className="text-slate-500 leading-relaxed font-light text-sm">
              Sustainability isn't just a buzzword for us—it's our foundation. By sourcing the finest organic materials and employing local artisans, we ensure that every piece is ethically crafted.
            </p>
            <p className="text-slate-500 leading-relaxed font-light text-sm">
              Our "Silk-and-Cloud" methodology ensures that no harsh chemicals ever touch your child's delicate skin. Only the softest, most breathable luxury.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="order-1 md:order-2 relative aspect-[3/4] rounded-[4rem] overflow-hidden shadow-2xl bg-neutral-soft">
            <img 
              src="https://images.unsplash.com/photo-1519233073527-38269f3396aa?q=80&w=800" 
              className="w-full h-full object-cover" 
              alt="Luxury Children Couture" 
            />
          </motion.div>
        </div>

        {/* The Signature */}
        <motion.div {...fadeUp} className="text-center py-20 border-t border-slate-100">
          <p className="text-sm font-bold tracking-[0.4em] text-accent-gold uppercase mb-8">For Every Little Majesty</p>
          <h3 className="text-5xl font-bold text-dark-slate mb-12">Crafted for <span className="italic font-normal">the future.</span></h3>
          <div className="flex justify-center">
            <div className="w-24 h-[1px] bg-dark-slate opacity-20" />
          </div>
          <p className="mt-12 text-slate-400 italic font-serif">A Promise of Luxury by Cozy Fits.pk</p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
