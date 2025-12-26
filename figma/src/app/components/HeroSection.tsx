import { motion } from 'motion/react';
import { Building2, Key, Home, TrendingUp, Users, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
}

const StatCard = ({ value, label, icon }: StatCardProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20"
    >
      <div className="text-[#d4af37]">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-white">{count}+</div>
        <div className="text-sm text-white/80">{label}</div>
      </div>
    </motion.div>
  );
};

const FloatingIcon = ({ icon, delay, x, y, duration }: { 
  icon: React.ReactNode; 
  delay: number; 
  x: string; 
  y: string;
  duration: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.2, 1],
      x: [0, 20, 0],
      y: [0, -30, 0]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      repeatType: "reverse"
    }}
    className="absolute text-white/20"
    style={{ left: x, top: y }}
  >
    {icon}
  </motion.div>
);

export const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8f] to-[#1e3a5f] overflow-hidden">
      {/* Floating Background Icons */}
      <FloatingIcon icon={<Building2 size={80} />} delay={0} x="10%" y="50px" duration={8} />
      <FloatingIcon icon={<Home size={60} />} delay={1} x="85%" y="100px" duration={10} />
      <FloatingIcon icon={<Key size={50} />} delay={0.5} x="15%" y="70%" duration={9} />
      <FloatingIcon icon={<Building2 size={70} />} delay={1.5} x="80%" y="65%" duration={11} />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-8 py-3">
              <span className="text-2xl font-bold text-white">AMG Real Estate</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            اعرض عقارك للتسويق مع AMG
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed"
          >
            نساعدك في تسويق وبيع عقارك بأفضل الأسعار مع فريق محترف ومتخصص
          </motion.p>

          {/* Trust Badges / Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12"
          >
            <StatCard
              value={500}
              label="عقار تم بيعه"
              icon={<Building2 size={32} />}
            />
            <StatCard
              value={1200}
              label="عميل راضٍ"
              icon={<Users size={32} />}
            />
            <StatCard
              value={15}
              label="سنة خبرة"
              icon={<Award size={32} />}
            />
          </motion.div>

          {/* Additional Trust Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 text-white/80 text-sm"
          >
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <TrendingUp size={18} className="text-[#d4af37]" />
              <span>تقييم مجاني لعقارك</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Users size={18} className="text-[#d4af37]" />
              <span>فريق محترف ومتخصص</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Award size={18} className="text-[#d4af37]" />
              <span>ضمان أفضل الأسعار</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};