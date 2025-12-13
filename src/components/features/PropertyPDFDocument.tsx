'use client'

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface PropertyPDFProps {
  property: {
    title: string;
    price: number;
    currency: string;
    area: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType: string;
    purpose: string;
    city: string;
    district: string;
    description: string;
    features?: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    images: { url: string }[];
  };
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  // Header Section
  header: {
    marginBottom: 20,
    borderBottom: '3 solid #2563eb',
    paddingBottom: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#6b7280',
  },
  
  // Title Section
  titleSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'right',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
    textAlign: 'right',
  },
  location: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 5,
    textAlign: 'right',
  },
  
  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  detailCard: {
    width: '48%',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
    textAlign: 'right',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  
  // Description Section
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'right',
    borderBottom: '2 solid #e5e7eb',
    paddingBottom: 5,
  },
  descriptionText: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 1.6,
    textAlign: 'right',
  },
  
  // Features List
  featuresList: {
    marginTop: 10,
  },
  featureItem: {
    fontSize: 11,
    color: '#4b5563',
    marginBottom: 5,
    textAlign: 'right',
    paddingRight: 10,
  },
  
  // Contact Section
  contactSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 10,
    textAlign: 'right',
  },
  contactInfo: {
    fontSize: 11,
    color: '#1f2937',
    marginBottom: 5,
    textAlign: 'right',
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    color: '#9ca3af',
  },
  watermark: {
    fontSize: 10,
    color: '#2563eb',
    fontWeight: 'bold',
  },
});

const PropertyPDFDocument: React.FC<PropertyPDFProps> = ({ property }) => {
  // Format price
  const formatPrice = (price: number, currency: string) => {
    const currencySymbol = currency === 'EGP' ? 'جنيه' : currency === 'USD' ? '$' : '€';
    return `${price.toLocaleString('ar-EG')} ${currencySymbol}`;
  };

  // Format property type
  const formatPropertyType = (type: string) => {
    const types: { [key: string]: string } = {
      APARTMENT: 'شقة',
      VILLA: 'فيلا',
      HOUSE: 'منزل',
      LAND: 'أرض',
      COMMERCIAL: 'تجاري',
      OFFICE: 'مكتب',
      STUDIO: 'استوديو',
      PENTHOUSE: 'بنتهاوس',
      CHALET: 'شاليه',
    };
    return types[type] || type;
  };

  // Format purpose
  const formatPurpose = (purpose: string) => {
    return purpose === 'SALE' ? 'للبيع' : 'للإيجار';
  };

  // Parse features
  const features = property.features ? property.features.split(',').map(f => f.trim()).filter(f => f) : [];

  return (
    <Document>
      {/* Page 1 - Cover & Main Details */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>AMG Real Estate</Text>
          <Text style={styles.subtitle}>شريكك الموثوق في عالم العقارات</Text>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>{property.title}</Text>
          <Text style={styles.priceText}>{formatPrice(property.price, property.currency)}</Text>
          <Text style={styles.location}>📍 {property.district}، {property.city}</Text>
        </View>

        {/* Image Placeholder */}
        <View style={{
          width: '100%',
          height: 200,
          backgroundColor: '#e5e7eb',
          borderRadius: 8,
          marginBottom: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>صورة العقار</Text>
          <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 5 }}>
            {property.images?.length || 0} صورة متاحة
          </Text>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>نوع العقار</Text>
            <Text style={styles.detailValue}>{formatPropertyType(property.propertyType)}</Text>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>الغرض</Text>
            <Text style={styles.detailValue}>{formatPurpose(property.purpose)}</Text>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>المساحة</Text>
            <Text style={styles.detailValue}>{property.area} م²</Text>
          </View>
          
          {property.bedrooms && (
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>غرف النوم</Text>
              <Text style={styles.detailValue}>{property.bedrooms}</Text>
            </View>
          )}
          
          {property.bathrooms && (
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>الحمامات</Text>
              <Text style={styles.detailValue}>{property.bathrooms}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>وصف العقار</Text>
          <Text style={styles.descriptionText}>{property.description}</Text>
        </View>

        {/* Features */}
        {features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المميزات</Text>
            <View style={styles.featuresList}>
              {features.map((feature, index) => (
                <Text key={index} style={styles.featureItem}>• {feature}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>معلومات التواصل</Text>
          <Text style={styles.contactInfo}>👤 {property.contactName}</Text>
          <Text style={styles.contactInfo}>📞 {property.contactPhone}</Text>
          <Text style={styles.contactInfo}>✉️ {property.contactEmail}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            تاريخ التقرير: {new Date().toLocaleDateString('ar-EG')}
          </Text>
          <Text style={styles.watermark}>AMG Real Estate</Text>
        </View>
      </Page>

      {/* Page 2 - Additional Images Info */}
      {property.images && property.images.length > 1 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>AMG Real Estate</Text>
            <Text style={styles.subtitle}>معلومات إضافية</Text>
          </View>

          <Text style={[styles.mainTitle, { marginTop: 20 }]}>{property.title}</Text>

          {/* Image Gallery Placeholder */}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>الصور المتاحة</Text>
            <View style={{
              backgroundColor: '#f3f4f6',
              padding: 20,
              borderRadius: 8,
              marginTop: 10,
            }}>
              <Text style={{ fontSize: 14, color: '#1f2937', textAlign: 'right', marginBottom: 10 }}>
                يحتوي هذا العقار على {property.images.length} صورة
              </Text>
              <Text style={{ fontSize: 11, color: '#6b7280', textAlign: 'right' }}>
                لمشاهدة جميع الصور، يرجى زيارة الموقع الإلكتروني
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>صفحة 2</Text>
            <Text style={styles.watermark}>AMG Real Estate</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};

export default PropertyPDFDocument;
