import { motion } from 'motion/react';
import { Upload, X, Image as ImageIcon, Star, Info } from 'lucide-react';
import { useState, useRef } from 'react';

interface PropertyImagesStepProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const PropertyImagesStep = ({ data, onDataChange }: PropertyImagesStepProps) => {
  const [images, setImages] = useState<string[]>(data.images || []);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === files.length) {
              const updatedImages = [...images, ...newImages];
              setImages(updatedImages);
              onDataChange({ ...data, images: updatedImages });
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onDataChange({ ...data, images: updatedImages });
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
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#1e3a5f]/5 to-[#d4af37]/5 border-r-4 border-[#d4af37] rounded-2xl p-6 mb-8 flex items-start gap-4"
        >
          <Info className="text-[#d4af37] flex-shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-bold text-[#1e3a5f] mb-2">نصيحة احترافية</h4>
            <p className="text-gray-600">
              صور احترافية وواضحة تزيد من فرص البيع بنسبة 80%. تأكد من التقاط صور في إضاءة جيدة ومن زوايا مختلفة.
            </p>
          </div>
        </motion.div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-3 border-dashed rounded-3xl p-12 transition-all duration-300 cursor-pointer
            ${isDragging
              ? 'border-[#d4af37] bg-[#d4af37]/10 scale-[1.02]'
              : 'border-gray-300 hover:border-[#d4af37]/50 hover:bg-gray-50'
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{
                y: isDragging ? -10 : [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: isDragging ? 0 : Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                <Upload className="text-white" size={40} />
              </div>
            </motion.div>

            <h3 className="text-2xl font-bold text-[#1e3a5f] mb-3">
              {isDragging ? 'أفلت الصور هنا' : 'اسحب الصور أو انقر للتحميل'}
            </h3>
            <p className="text-gray-600 mb-6">
              يمكنك تحميل عدة صور في نفس الوقت (JPG, PNG)
            </p>

            <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200">
                <ImageIcon size={16} />
                <span>صور عالية الجودة</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200">
                <Star size={16} />
                <span>زوايا متعددة</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">
              الصور المحملة ({images.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100"
                >
                  <img
                    src={image}
                    alt={`صورة ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Main Image Badge */}
                  {index === 0 && (
                    <div className="absolute top-3 right-3 bg-[#d4af37] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Star size={14} fill="white" />
                      <span>الصورة الرئيسية</span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                    <motion.button
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      <X size={20} />
                    </motion.button>
                  </div>

                  {/* Image Number */}
                  <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2.5 py-1 rounded-full text-xs">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl"
            >
              💡 يمكنك إعادة ترتيب الصور بسحبها. الصورة الأولى ستكون الصورة الرئيسية للعقار.
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
