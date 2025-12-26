import { motion } from 'motion/react';
import { Building2, Camera, Phone, CheckCircle2 } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  steps: Array<{
    id: number;
    title: string;
    icon: React.ReactNode;
  }>;
}

export const ProgressStepper = ({ currentStep, steps }: StepperProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="relative">
        {/* Progress Line Background */}
        <div className="absolute top-8 right-0 left-0 h-1 bg-gray-200 rounded-full" style={{ width: 'calc(100% - 64px)', marginRight: '32px', marginLeft: '32px' }}></div>
        
        {/* Animated Progress Line */}
        <motion.div
          className="absolute top-8 right-0 h-1 bg-gradient-to-l from-[#1e3a5f] to-[#d4af37] rounded-full"
          initial={{ width: 0 }}
          animate={{ 
            width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - ${64 - (64 * (currentStep - 1) / (steps.length - 1))}px)`
          }}
          transition={{ duration: 0.5 }}
          style={{ marginRight: '32px' }}
        ></motion.div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <div key={step.id} className="flex flex-col items-center" style={{ zIndex: 10 }}>
                {/* Icon Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    boxShadow: isCurrent ? '0 0 20px rgba(212, 175, 55, 0.5)' : '0 0 0 rgba(0,0,0,0)'
                  }}
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300
                    ${isCompleted ? 'bg-green-500 border-green-500' : ''}
                    ${isCurrent ? 'bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] border-[#d4af37]' : ''}
                    ${isPending ? 'bg-white border-gray-300' : ''}
                  `}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle2 className="text-white" size={32} />
                    </motion.div>
                  ) : (
                    <div className={`${isCurrent || isPending ? (isCurrent ? 'text-white' : 'text-gray-400') : 'text-white'}`}>
                      {step.icon}
                    </div>
                  )}
                </motion.div>

                {/* Step Title */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.05 : 1,
                    color: isCurrent ? '#1e3a5f' : isCompleted ? '#10b981' : '#9ca3af'
                  }}
                  className="mt-3 text-center"
                >
                  <div className="font-semibold text-sm md:text-base whitespace-nowrap">
                    {step.title}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const stepperData = [
  {
    id: 1,
    title: 'بيانات العقار',
    icon: <Building2 size={28} />
  },
  {
    id: 2,
    title: 'صور العقار',
    icon: <Camera size={28} />
  },
  {
    id: 3,
    title: 'معلومات التواصل',
    icon: <Phone size={28} />
  },
  {
    id: 4,
    title: 'تأكيد الطلب',
    icon: <CheckCircle2 size={28} />
  }
];
