import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp } from '../../../shared/utils/constants';
import MaterialIcon from '../../../shared/components/MaterialIcon';
import type { PropertyManagementData, TrustStat } from '../../../shared/models/types';

interface WhyChooseUsProps {
  data: PropertyManagementData;
}

const STAT_ICONS: Record<string, string> = {
  retention: 'trending_up',
  support: 'support_agent',
};

function parseStatValue(value: string): { target: number; suffix: string } | null {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return null;
  return { target: parseInt(match[1], 10), suffix: match[2] };
}

function StatCounter({ stat, isInView }: { stat: TrustStat; isInView: boolean }) {
  const parsed = parseStatValue(stat.value);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || !parsed) return;
    const duration = 1200;
    const start = performance.now();

    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * parsed.target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, parsed?.target]);

  return <>{parsed ? `${count}${parsed.suffix}` : stat.value}</>;
}

export default function WhyChooseUs({ data }: WhyChooseUsProps) {
  const sectionRef1 = useRef(null);
  const isInView1 = useInView(sectionRef1, { once: true, amount: 0.2, margin: '-80px' });

  return (
    <section id="why-choose-us" className="py-section-gap-mobile md:py-section-gap-desktop relative">
      <div className="max-w-container-max-width mx-auto px-6">
        <motion.div
          ref={sectionRef1}
          initial="hidden"
          animate={isInView1 ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="bg-primary-container rounded-[40px] overflow-hidden relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <h2 className="font-headline-md text-headline-md text-on-primary mb-6">{data.whyChooseHeading}</h2>
              <p className="font-body-lg text-body-lg text-primary-fixed-dim mb-8 text-justify">{data.whyChooseBody}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.trustStats.map((stat, index) => (
                  <motion.div
                    key={stat.id}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="bg-on-primary/5 hover:bg-on-primary/10 border border-on-primary/10 rounded-2xl p-5 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-8 rounded-full bg-teal/90 flex items-center justify-center flex-shrink-0">
                        <MaterialIcon
                          name={STAT_ICONS[stat.id] ?? 'insights'}
                          filled
                          className="text-on-primary text-base"
                        />
                      </span>
                      <h4 className="font-headline-sm text-headline-sm text-on-primary">
                        <StatCounter stat={stat} isInView={isInView1} />
                      </h4>
                    </div>
                    <p className="font-body-md text-body-md text-primary-fixed-dim">{stat.label}</p>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={isInView1 ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="h-1 rounded-full bg-teal mt-3 origin-left"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="relative min-h-[400px] overflow-hidden group"
            >
              <motion.img
                src={data.whyChooseImage.src}
                alt={data.whyChooseImage.alt}
                variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-primary-container" />
              <motion.div
                variants={{ rest: { opacity: 0, y: 12 }, hover: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.35 }}
                className="absolute bottom-6 left-6 right-6 bg-surface/95 backdrop-blur rounded-2xl p-4 flex items-center gap-3 shadow-card"
              >
                <span className="w-10 h-10 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                  <MaterialIcon name="favorite" filled className="text-on-primary text-lg" />
                </span>
                <p className="font-label-bold text-label-bold text-primary">Cared for like family</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
