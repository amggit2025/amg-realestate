// Types for our real estate application

export interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: 'EGP' | 'USD'
  negotiable?: boolean
  area: number
  location: {
    city: string
    district: string
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  type: 'apartment' | 'villa' | 'office' | 'commercial' | 'land'
  purpose: 'sale' | 'rent'
  bedrooms?: number
  bathrooms?: number
  floors?: number
  floor?: number
  parking?: boolean
  furnished?: boolean
  images: string[]
  features: string[]
  additionalDetails?: string
  contact: {
    name: string
    phone: string
    email: string
  }
  status: 'active' | 'sold' | 'rented' | 'pending'
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface Project {
  id: string
  title: string
  description: string
  location: {
    city: string
    district: string
    address: string
  }
  developer: string
  projectType: 'residential' | 'commercial' | 'mixed'
  status: 'planning' | 'under-construction' | 'completed' | 'delivered'
  deliveryDate?: Date
  totalUnits?: number
  availableUnits?: number
  priceRange: {
    min: number
    max: number
    currency: 'EGP' | 'USD'
  }
  images: string[]
  floorPlans?: string[]
  amenities: string[]
  features: string[]
  contact: {
    name: string
    phone: string
    email: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  userType: 'individual' | 'agent' | 'company' | 'admin'
  verified: boolean
  properties: Property[]
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  pricing?: {
    type: 'fixed' | 'hourly' | 'percentage'
    amount: number
    currency: 'EGP' | 'USD'
  }
  category: 'real-estate' | 'marketing' | 'construction' | 'furniture' | 'kitchen'
  available: boolean
}

export interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  rating: number
  text: string
  project: string
  image?: string
  verified: boolean
  createdAt: Date
}

export interface ContactForm {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  propertyId?: string
  projectId?: string
}

export interface SearchFilters {
  type?: Property['type']
  purpose?: Property['purpose']
  city?: string
  district?: string
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  bedrooms?: number
  bathrooms?: number
  furnished?: boolean
  parking?: boolean
}
