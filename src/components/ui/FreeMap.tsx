'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Load Leaflet CSS only when map is used
if (typeof window !== 'undefined') {
  import('leaflet/dist/leaflet.css');
}

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

  // مواقع الفروع
  const locations = [
    {
      lat: 31.2568,
      lng: 32.2910,
      name: "فرع بورسعيد",
      address: "بورسعيد، مصر",
      color: "blue"
    },
    {
      lat: 30.0444,
      lng: 31.2357,
      name: "فرع التجمع الخامس", 
      address: "قريب من مول 7K، التجمع الخامس، القاهرة الجديدة",
      color: "red"
    }
  ];

  useEffect(() => {
    // تحميل Leaflet والـ CSS فقط في الـ client
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && document && document.head) {
        const L = await import('leaflet');
        
        // الـ CSS محمل من globals.css

        // Fix للـ default markers
        try {
          delete (L.default.Icon.Default.prototype as any)._getIconUrl;
          L.default.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          });
        } catch (error) {
          console.log('Marker fix skipped:', error);
        }

        setLeaflet(L.default);
        setIsClient(true);
      }
    };

    // تأخير صغير عشان نتأكد إن الـ DOM جاهز
    const timer = setTimeout(loadLeaflet, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isClient || !leaflet) {
    return (
      <div className={`bg-gray-200 rounded-2xl flex items-center justify-center h-96 ${className}`}>
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg ${className}`}>
      <MapContainer
        center={[30.5, 31.7]} // نقطة وسط بين القاهرة وبورسعيد
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* عرض جميع المواقع */}
        {locations.map((location, index) => (
          <Marker key={index} position={[location.lat, location.lng]}>
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {location.name}
                </h3>
                <h4 className="font-medium text-blue-600 mb-2">
                  مجموعة أحمد المللاح
                </h4>
                <p className="text-gray-600 text-sm">
                  {location.address}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}