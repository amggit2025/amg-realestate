import { motion } from 'motion/react';
import { Building2, Home, Building, Warehouse, Landmark, MapPin, Store, Briefcase, DollarSign, Ruler, Trees, Droplets, Car, Dumbbell, Shield, Wifi } from 'lucide-react';
import { useState } from 'react';

export const propertyTypes = [
  { id: 'apartment', label: 'شقة', icon: <Building2 size={32} /> },
  { id: 'villa', label: 'فيلا', icon: <Home size={32} /> },
  { id: 'townhouse', label: 'تاون هاوس', icon: <Building size={32} /> },
  { id: 'duplex', label: 'دوبلكس', icon: <Warehouse size={32} /> },
  { id: 'penthouse', label: 'بنتهاوس', icon: <Landmark size={32} /> },
  { id: 'land', label: 'أرض', icon: <MapPin size={32} /> },
  { id: 'office', label: 'مكتب', icon: <Briefcase size={32} /> },
  { id: 'shop', label: 'محل تجاري', icon: <Store size={32} /> },
];

const features = [
  { id: 'garden', label: 'حديقة', icon: <Trees size={18} /> },
  { id: 'pool', label: 'مسبح', icon: <Droplets size={18} /> },
  { id: 'garage', label: 'جراج', icon: <Car size={18} /> },
  { id: 'gym', label: 'صالة رياضية', icon: <Dumbbell size={18} /> },
  { id: 'security', label: 'حراسة أمنية', icon: <Shield size={18} /> },
  { id: 'wifi', label: 'إنترنت', icon: <Wifi size={18} /> },
];

const governorates = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الشرقية',
  'الدقهلية',
  'القليوبية',
  'المنوفية',
  'البحيرة',
  'أسيوط',
  'سوهاج'
];

interface PropertyDetailsStepProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const PropertyDetailsStep = ({ data, onDataChange }: PropertyDetailsStepProps) => {
  const [selectedType, setSelectedType] = useState(data.propertyType || '');
  const [purpose, setPurpose] = useState(data.purpose || 'sale');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(data.features || []);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    onDataChange({ ...data, propertyType: typeId });
  };

  const handlePurposeChange = (newPurpose: string) => {
    setPurpose(newPurpose);
    onDataChange({ ...data, purpose: newPurpose });
  };

  const toggleFeature = (featureId: string) => {
    const newFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(f => f !== featureId)
      : [...selectedFeatures, featureId];
    setSelectedFeatures(newFeatures);
    onDataChange({ ...data, features: newFeatures });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
        {/* Property Type Selector */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">نوع العقار</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {propertyTypes.map((type, index) => (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleTypeSelect(type.id)}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all duration-300
                  ${selectedType === type.id
                    ? 'border-[#d4af37] bg-gradient-to-br from-[#1e3a5f]/5 to-[#d4af37]/5 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-[#d4af37]/50 hover:shadow-md'
                  }
                `}
              >
                <div className={`mb-3 ${selectedType === type.id ? 'text-[#d4af37]' : 'text-gray-600'}`}>
                  {type.icon}
                </div>
                <div className={`font-semibold ${selectedType === type.id ? 'text-[#1e3a5f]' : 'text-gray-700'}`}>
                  {type.label}
                </div>
                {selectedType === type.id && (
                  <motion.div
                    layoutId="selected-type"
                    className="absolute -top-2 -right-2 w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-white text-xl"
                    >
                      ✓
                    </motion.div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Purpose Toggle */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">الغرض</h3>
          <div className="inline-flex rounded-2xl bg-gray-100 p-1.5">
            <button
              onClick={() => handlePurposeChange('sale')}
              className={`
                px-8 py-3 rounded-xl font-semibold transition-all duration-300
                ${purpose === 'sale'
                  ? 'bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] text-white shadow-lg'
                  : 'text-gray-600 hover:text-[#1e3a5f]'
                }
              `}
            >
              للبيع
            </button>
            <button
              onClick={() => handlePurposeChange('rent')}
              className={`
                px-8 py-3 rounded-xl font-semibold transition-all duration-300
                ${purpose === 'rent'
                  ? 'bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] text-white shadow-lg'
                  : 'text-gray-600 hover:text-[#1e3a5f]'
                }
              `}
            >
              للإيجار
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Governorate */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">المحافظة</label>
            <div className="relative">
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
              <select
                value={data.governorate || ''}
                onChange={(e) => onDataChange({ ...data, governorate: e.target.value })}
                className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none transition-all duration-300 bg-white"
              >
                <option value="">اختر المحافظة</option>
                {governorates.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
          </div>

          {/* City */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">المدينة / المنطقة</label>
            <div className="relative">
              <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
              <input
                type="text"
                value={data.city || ''}
                onChange={(e) => onDataChange({ ...data, city: e.target.value })}
                placeholder="مثال: التجمع الخامس"
                className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Area */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">المساحة (متر مربع)</label>
            <div className="relative">
              <Ruler className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
              <input
                type="number"
                value={data.area || ''}
                onChange={(e) => onDataChange({ ...data, area: e.target.value })}
                placeholder="200"
                className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Price */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">السعر (جنيه مصري)</label>
            <div className="relative">
              <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
              <input
                type="number"
                value={data.price || ''}
                onChange={(e) => onDataChange({ ...data, price: e.target.value })}
                placeholder="2500000"
                className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">عدد الغرف</label>
            <input
              type="number"
              value={data.bedrooms || ''}
              onChange={(e) => onDataChange({ ...data, bedrooms: e.target.value })}
              placeholder="3"
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Bathrooms */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">عدد الحمامات</label>
            <input
              type="number"
              value={data.bathrooms || ''}
              onChange={(e) => onDataChange({ ...data, bathrooms: e.target.value })}
              placeholder="2"
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Features */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">المميزات</h3>
          <div className="flex flex-wrap gap-3">
            {features.map((feature) => (
              <motion.button
                key={feature.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleFeature(feature.id)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all duration-300
                  ${selectedFeatures.includes(feature.id)
                    ? 'border-[#d4af37] bg-[#d4af37] text-white shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-[#d4af37]/50'
                  }
                `}
              >
                {feature.icon}
                <span className="font-medium">{feature.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">وصف العقار</label>
          <textarea
            value={data.description || ''}
            onChange={(e) => onDataChange({ ...data, description: e.target.value })}
            placeholder="اكتب وصف تفصيلي للعقار..."
            rows={6}
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none transition-all duration-300 resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
};