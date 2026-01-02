'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamic import للخريطة بدون SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface FreeMapProps {
  lat?: number;
  lng?: number;
  address?: string;
  className?: string;
}

export default function FreeMap({ 
  lat = 30.0444, 
  lng = 31.2357, 
  address = "القاهرة الجديدة، مصر",
  className = "" 
}: FreeMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [leaflet, setLeaflet] = useState<any>(null);
  const [customIcons, setCustomIcons] = useState<any>({});

  // مواقع الفروع (إحداثيات دقيقة)
  const locations = [
    {
      lat: 31.2568,
      lng: 32.2910,
      name: "فرع بورسعيد",
      address: "شارع الجمهورية، بورسعيد، مصر",
      phone: "+20 123 456 7890",
      isMain: false,
      color: "#3B82F6" // أزرق
    },
    {
      lat: 30.0330,
      lng: 31.3480,
      name: "المقر الرئيسي", 
      address: "التجمع الخامس، القاهرة الجديدة، القاهرة",
      phone: "+20 123 456 7891",
      isMain: true,
      color: "#EF4444" // أحمر
    }
  ];

  useEffect(() => {
    // تحميل Leaflet والـ CSS فقط في الـ client
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && document && document.head) {
        const L = await import('leaflet');
        
        // إنشاء أيقونات مخصصة لكل فرع
        const createCustomIcon = (color: string, isMain: boolean) => {
          const size = isMain ? 40 : 32;
          const iconHtml = `
            <div style="
              width: ${size}px;
              height: ${size}px;
              background: ${color};
              border: 4px solid white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          `;

          return L.default.divIcon({
            html: iconHtml,
            className: 'custom-map-marker',
            iconSize: [size, size],
            iconAnchor: [size / 2, size],
            popupAnchor: [0, -size]
          });
        };

        const icons: any = {};
        locations.forEach((loc, idx) => {
          icons[idx] = createCustomIcon(loc.color, loc.isMain);
        });

        setCustomIcons(icons);
        setLeaflet(L.default);
        setIsClient(true);
      }
    };

    const timer = setTimeout(loadLeaflet, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isClient || !leaflet || Object.keys(customIcons).length === 0) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl flex items-center justify-center h-96 ${className}`}>
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto mb-3"></div>
          <p className="font-semibold text-lg">جاري تحميل الخريطة...</p>
          <p className="text-sm text-gray-500 mt-1">انتظر قليلاً</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          padding: 0;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0;
          min-width: 260px;
        }
        .leaflet-popup-tip {
          box-shadow: 0 3px 14px rgba(0,0,0,0.2);
        }
        .custom-map-marker {
          transition: all 0.3s ease;
        }
        .custom-map-marker:hover {
          transform: scale(1.15);
          filter: brightness(1.1);
        }
      `}</style>
      
      <MapContainer
        center={[30.65, 31.8]} // نقطة وسط بين الفرعين
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        {/* عرض جميع المواقع مع أيقونات مخصصة */}
        {locations.map((location, index) => (
          <Marker 
            key={index} 
            position={[location.lat, location.lng]}
            icon={customIcons[index]}
          >
            <Popup>
              <div className="p-4 bg-gradient-to-br from-white to-slate-50">
                {/* Badge للفرع الرئيسي */}
                {location.isMain && (
                  <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    ⭐ المقر الرئيسي
                  </div>
                )}
                
                {/* اسم الفرع */}
                <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  {location.name}
                </h3>
                
                {/* اسم الشركة */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-2 rounded-lg mb-3 text-center">
                  <h4 className="font-bold text-sm">
                    مجموعة أحمد الملاح
                  </h4>
                </div>
                
                {/* العنوان */}
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-slate-500 text-sm">📌</span>
                  <p className="text-gray-700 text-sm leading-relaxed flex-1">
                    {location.address}
                  </p>
                </div>
                
                {/* الهاتف */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-600 text-sm">📞</span>
                  <a 
                    href={`tel:${location.phone}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    {location.phone}
                  </a>
                </div>
                
                {/* زر الاتجاهات */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-2 px-4 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                >
                  🧭 احصل على الاتجاهات
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}