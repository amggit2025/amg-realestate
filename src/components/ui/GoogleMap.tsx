'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Location {
  lat: number;
  lng: number;
  name: string;
  address: string;
  phone: string;
  isMain: boolean;
}

interface GoogleMapProps {
  className?: string;
}

export default function GoogleMap({ className = "" }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // مواقع الفروع
  const locations: Location[] = [
    {
      lat: 31.2568,
      lng: 32.2910,
      name: "فرع بورسعيد",
      address: "شارع الجمهورية، بورسعيد، مصر",
      phone: "+20 123 456 7890",
      isMain: false,
    },
    {
      lat: 30.0330,
      lng: 31.3480,
      name: "المقر الرئيسي",
      address: "التجمع الخامس، القاهرة الجديدة، القاهرة",
      phone: "+20 123 456 7891",
      isMain: true,
    }
  ];

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places', 'marker']
        });

        const google = await loader.load();
        
        if (!mapRef.current) return;

        // إنشاء الخريطة
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 30.65, lng: 31.8 }, // نقطة وسط
          zoom: 8,
          mapId: 'AMG_REALESTATE_MAP', // مهم للـ Advanced Markers
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            }
          ],
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
        });

        // إضافة علامات لكل موقع
        locations.forEach((location) => {
          // إنشاء محتوى العلامة المخصصة
          const markerContent = document.createElement('div');
          markerContent.style.width = location.isMain ? '40px' : '32px';
          markerContent.style.height = location.isMain ? '40px' : '32px';
          markerContent.style.background = location.isMain ? '#EF4444' : '#3B82F6';
          markerContent.style.border = '4px solid white';
          markerContent.style.borderRadius = '50% 50% 50% 0';
          markerContent.style.transform = 'rotate(-45deg)';
          markerContent.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          markerContent.style.display = 'flex';
          markerContent.style.alignItems = 'center';
          markerContent.style.justifyContent = 'center';
          markerContent.style.cursor = 'pointer';
          markerContent.innerHTML = `<div style="width: 12px; height: 12px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>`;

          // إنشاء العلامة
          const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name,
            icon: {
              url: `data:image/svg+xml,${encodeURIComponent(`
                <svg width="${location.isMain ? 40 : 32}" height="${location.isMain ? 40 : 32}" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                      <feOffset dx="0" dy="2" result="offsetblur"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <g filter="url(#shadow)">
                    <path d="M ${location.isMain ? 20 : 16} 0 
                             C ${location.isMain ? 8 : 7} 0, 0 ${location.isMain ? 8 : 7}, 0 ${location.isMain ? 20 : 16}
                             C 0 ${location.isMain ? 28 : 22}, ${location.isMain ? 8 : 7} ${location.isMain ? 36 : 28}, ${location.isMain ? 20 : 16} ${location.isMain ? 40 : 32}
                             C ${location.isMain ? 32 : 25} ${location.isMain ? 36 : 28}, ${location.isMain ? 40 : 32} ${location.isMain ? 28 : 22}, ${location.isMain ? 40 : 32} ${location.isMain ? 20 : 16}
                             C ${location.isMain ? 40 : 32} ${location.isMain ? 8 : 7}, ${location.isMain ? 32 : 25} 0, ${location.isMain ? 20 : 16} 0 Z" 
                          fill="${location.isMain ? '#EF4444' : '#3B82F6'}" 
                          stroke="white" 
                          stroke-width="4"/>
                    <circle cx="${location.isMain ? 20 : 16}" cy="${location.isMain ? 18 : 14}" r="6" fill="white"/>
                  </g>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(location.isMain ? 40 : 32, location.isMain ? 40 : 32),
              anchor: new google.maps.Point(location.isMain ? 20 : 16, location.isMain ? 40 : 32),
            },
            animation: google.maps.Animation.DROP,
          });

          // محتوى InfoWindow
          const infoWindowContent = `
            <div style="padding: 16px; min-width: 280px; font-family: 'Cairo', sans-serif;">
              ${location.isMain ? `
                <div style="display: inline-block; background: linear-gradient(135deg, #EF4444, #F97316); 
                            color: white; font-size: 11px; font-weight: bold; padding: 4px 12px; 
                            border-radius: 20px; margin-bottom: 12px;">
                  ⭐ المقر الرئيسي
                </div>
              ` : ''}
              
              <h3 style="font-size: 18px; font-weight: bold; color: #1F2937; margin: 0 0 8px 0; 
                         display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 24px;">📍</span>
                ${location.name}
              </h3>
              
              <div style="background: linear-gradient(135deg, #2563EB, #1E40AF); color: white; 
                          padding: 8px 12px; border-radius: 8px; text-align: center; margin-bottom: 12px;">
                <h4 style="margin: 0; font-size: 13px; font-weight: bold;">مجموعة أحمد الملاح</h4>
              </div>
              
              <div style="display: flex; align-items: start; gap: 8px; margin-bottom: 8px;">
                <span style="color: #64748B; font-size: 14px;">📌</span>
                <p style="margin: 0; color: #374151; font-size: 13px; line-height: 1.5; flex: 1;">
                  ${location.address}
                </p>
              </div>
              
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span style="color: #10B981; font-size: 14px;">📞</span>
                <a href="tel:${location.phone}" 
                   style="color: #2563EB; text-decoration: none; font-weight: 500; font-size: 13px;">
                  ${location.phone}
                </a>
              </div>
              
              <a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}"
                 target="_blank"
                 style="display: block; width: 100%; background: linear-gradient(135deg, #2563EB, #1E40AF); 
                        color: white; text-align: center; padding: 10px; border-radius: 8px; 
                        text-decoration: none; font-weight: 600; font-size: 13px; 
                        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3); transition: all 0.2s;">
                🧭 احصل على الاتجاهات
              </a>
            </div>
          `;

          const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
            maxWidth: 320,
          });

          // عرض InfoWindow عند الضغط
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          // تأثير hover
          marker.addListener('mouseover', () => {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => marker.setAnimation(null), 700);
          });
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('فشل تحميل الخريطة');
        setIsLoading(false);
      }
    };

    initMap();
  }, []);

  if (error) {
    return (
      <div className={`bg-red-50 rounded-2xl flex items-center justify-center h-96 ${className}`}>
        <div className="text-center text-red-600">
          <p className="font-semibold">{error}</p>
          <p className="text-sm mt-2">يرجى المحاولة لاحقاً</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl flex items-center justify-center h-96 ${className}`}>
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto mb-3"></div>
          <p className="font-semibold text-lg">جاري تحميل خريطة Google...</p>
          <p className="text-sm text-gray-500 mt-1">انتظر قليلاً</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '400px' }} />
    </div>
  );
}
