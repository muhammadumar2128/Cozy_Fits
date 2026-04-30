import React from 'react';
import { motion } from 'framer-motion';
import { Ruler, Info } from 'lucide-react';

const SizeGuide = () => {
  const sizes = [
    { size: 'NB', age: 'New Born', height: '50-56cm', weight: '3-4kg' },
    { size: '3M', age: '0-3 Months', height: '56-62cm', weight: '4-6kg' },
    { size: '6M', age: '3-6 Months', height: '62-68cm', weight: '6-8kg' },
    { size: '1Y', age: '12 Months', height: '74-80cm', weight: '9-11kg' },
    { size: '2Y', age: '2 Years', height: '86-92cm', weight: '12-14kg' },
    { size: '3Y', age: '3 Years', height: '94-98cm', weight: '14-16kg' },
    { size: '4Y', age: '4 Years', height: '100-104cm', weight: '16-18kg' },
    { size: '6Y', age: '6 Years', height: '112-116cm', weight: '20-22kg' },
  ];

  return (
    <div className="min-h-screen pt-32 sm:pt-48 pb-20 sm:pb-32 px-6 bg-silk">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center text-accent-gold">
              <Ruler size={24} />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-dark-slate uppercase tracking-tighter">
              Size <span className="italic font-normal text-accent-gold">Guide</span>
            </h1>
          </div>

          <p className="text-slate-500 text-lg mb-12 max-w-2xl leading-relaxed font-light">
            Finding the perfect fit for your little one is essential for their comfort. Use our comprehensive size chart below as a general guide. If you are between sizes, we recommend sizing up.
          </p>

          <div className="glass rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-dark-slate text-white">
                  <th className="px-8 py-6 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">Size</th>
                  <th className="px-8 py-6 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">Age Group</th>
                  <th className="px-8 py-6 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">Height</th>
                  <th className="px-8 py-6 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-right">Weight</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 font-medium">
                {sizes.map((item, idx) => (
                  <tr key={item.size} className={`border-b border-slate-50 transition-colors hover:bg-slate-50/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}>
                    <td className="px-8 py-5 text-sm sm:text-base font-bold text-dark-slate">{item.size}</td>
                    <td className="px-8 py-5 text-sm">{item.age}</td>
                    <td className="px-8 py-5 text-sm">{item.height}</td>
                    <td className="px-8 py-5 text-sm text-right">{item.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-100 space-y-4">
              <div className="flex items-center space-x-3 text-dark-slate">
                <Info size={18} />
                <h3 className="font-bold text-[10px] sm:text-xs tracking-widest uppercase">Measuring Tips</h3>
              </div>
              <ul className="space-y-3 text-slate-500 text-sm leading-relaxed font-light list-disc pl-4">
                <li>Measure height from the top of the head to the floor without shoes.</li>
                <li>Weight is often the best indicator for babies between height milestones.</li>
                <li>Our UK imported pieces are designed with a generous fit to accommodate growth.</li>
              </ul>
            </div>

            <div className="bg-accent-gold/5 p-8 rounded-[2rem] border border-accent-gold/10 space-y-4">
              <h3 className="font-bold text-[10px] sm:text-xs tracking-widest uppercase text-accent-gold">Need Help?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                If you're still unsure about the sizing for a specific piece, our styling experts are here to help via WhatsApp.
              </p>
              <a 
                href="https://wa.me/923315033299" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-dark-slate text-white px-6 py-3 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-accent-gold transition-all shadow-lg"
              >
                Contact Expert
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SizeGuide;
