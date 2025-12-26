import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { HeroSection } from './components/HeroSection';
import { ProgressStepper, stepperData } from './components/ProgressStepper';
import { PropertyDetailsStep } from './components/PropertyDetailsStep';
import { PropertyImagesStep } from './components/PropertyImagesStep';
import { ContactInfoStep } from './components/ContactInfoStep';
import { SuccessStep } from './components/SuccessStep';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

interface FormData {
  // Step 1 - Property Details
  propertyType: string;
  purpose: string;
  governorate: string;
  city: string;
  area: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  features: string[];
  description: string;
  
  // Step 2 - Images
  images: string[];
  
  // Step 3 - Contact
  name: string;
  phone: string;
  email: string;
  preferredTime: string;
  services: string[];
}

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    propertyType: '',
    purpose: 'sale',
    governorate: '',
    city: '',
    area: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    features: [],
    description: '',
    images: [],
    name: '',
    phone: '',
    email: '',
    preferredTime: '',
    services: [],
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDataChange = (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PropertyDetailsStep data={formData} onDataChange={handleDataChange} />;
      case 2:
        return <PropertyImagesStep data={formData} onDataChange={handleDataChange} />;
      case 3:
        return <ContactInfoStep data={formData} onDataChange={handleDataChange} />;
      case 4:
        return <SuccessStep data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl" style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}>
      {/* Hero Section */}
      <HeroSection />

      {/* Progress Stepper */}
      <div className="bg-white border-b border-gray-200">
        <ProgressStepper currentStep={currentStep} steps={stepperData} />
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto mt-8 flex justify-between items-center gap-4"
          >
            {/* Previous Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`
                flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300
                ${currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-gray-50 hover:shadow-lg'
                }
              `}
            >
              <ChevronRight size={20} />
              <span>السابق</span>
            </motion.button>

            {/* Step Indicator */}
            <div className="text-center">
              <div className="text-sm text-gray-600">الخطوة</div>
              <div className="font-bold text-[#1e3a5f]">{currentStep} من 3</div>
            </div>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] text-white hover:shadow-xl transition-all duration-300"
            >
              <span>{currentStep === 3 ? 'إرسال الطلب' : 'التالي'}</span>
              <ChevronLeft size={20} />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">AMG Real Estate</div>
          <p className="text-white/80 mb-6">شريكك الموثوق في عالم العقارات</p>
          <div className="flex justify-center gap-6 text-sm text-white/70">
            <a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">تواصل معنا</a>
          </div>
          <div className="mt-6 text-white/60 text-sm">
            © 2025 AMG Real Estate. جميع الحقوق محفوظة
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
