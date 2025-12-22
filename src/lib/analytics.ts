/**
 * Google Analytics & Performance Tracking
 * يوفر دوال لتتبع الأحداث والصفحات في Google Analytics
 */

// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// تحقق من تفعيل Analytics
export const isAnalyticsEnabled = (): boolean => {
  return !!GA_MEASUREMENT_ID && process.env.NODE_ENV === 'production'
}

// Page view tracking
export const pageview = (url: string) => {
  if (!isAnalyticsEnabled()) return

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Event tracking
interface EventParams {
  action: string
  category: string
  label?: string
  value?: number
  [key: string]: any
}

export const event = ({ action, category, label, value, ...params }: EventParams) => {
  if (!isAnalyticsEnabled()) return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...params,
  })
}

// Predefined events for common actions
export const trackPropertyView = (propertyId: string, propertyTitle: string) => {
  event({
    action: 'view_property',
    category: 'Properties',
    label: propertyTitle,
    property_id: propertyId,
  })
}

export const trackPropertyInquiry = (propertyId: string, inquiryType: 'phone' | 'whatsapp' | 'email') => {
  event({
    action: 'property_inquiry',
    category: 'Engagement',
    label: inquiryType,
    property_id: propertyId,
  })
}

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'Search',
    label: searchTerm,
    value: resultsCount,
  })
}

export const trackProjectView = (projectId: string, projectName: string) => {
  event({
    action: 'view_project',
    category: 'Projects',
    label: projectName,
    project_id: projectId,
  })
}

export const trackServiceView = (serviceSlug: string, serviceName: string) => {
  event({
    action: 'view_service',
    category: 'Services',
    label: serviceName,
    service_slug: serviceSlug,
  })
}

export const trackContactForm = (formType: 'inquiry' | 'contact' | 'service_request') => {
  event({
    action: 'submit_form',
    category: 'Forms',
    label: formType,
  })
}

export const trackUserRegistration = (method: 'email') => {
  event({
    action: 'sign_up',
    category: 'User',
    label: method,
  })
}

export const trackUserLogin = (method: 'email') => {
  event({
    action: 'login',
    category: 'User',
    label: method,
  })
}

export const trackPropertySubmission = (propertyType: string) => {
  event({
    action: 'submit_property',
    category: 'User_Generated_Content',
    label: propertyType,
  })
}

// Performance tracking
export const trackPerformance = (metricName: string, value: number) => {
  if (!isAnalyticsEnabled()) return

  window.gtag('event', 'timing_complete', {
    name: metricName,
    value: Math.round(value),
    event_category: 'Performance',
  })
}

// Core Web Vitals tracking
export const trackWebVitals = (metric: any) => {
  if (!isAnalyticsEnabled()) return

  window.gtag('event', metric.name, {
    event_category: 'Web Vitals',
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
  })
}

// Error tracking
export const trackError = (error: Error, errorInfo?: any) => {
  if (!isAnalyticsEnabled()) return

  event({
    action: 'error',
    category: 'Errors',
    label: error.message,
    error_name: error.name,
    error_stack: error.stack?.substring(0, 150), // First 150 chars
  })
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
  }
}
