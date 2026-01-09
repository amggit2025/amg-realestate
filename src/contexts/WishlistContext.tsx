'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Product type for wishlist items
export interface WishlistProduct {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  inStock: boolean
}

interface WishlistContextType {
  items: WishlistProduct[]
  addToWishlist: (product: WishlistProduct) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  getWishlistItems: () => WishlistProduct[]
  clearWishlist: () => void
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const WISHLIST_STORAGE_KEY = 'amg-store-wishlist'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistProduct[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist)
        setItems(parsed)
      } catch (error) {
        console.error('Error loading wishlist:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addToWishlist = (product: WishlistProduct) => {
    setItems(prev => {
      // Check if already in wishlist
      if (prev.some(item => item.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId: number) => {
    setItems(prev => prev.filter(item => item.id !== productId))
  }

  const isInWishlist = (productId: number): boolean => {
    return items.some(item => item.id === productId)
  }

  const getWishlistItems = (): WishlistProduct[] => {
    return items
  }

  const clearWishlist = () => {
    setItems([])
  }

  const wishlistCount = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistItems,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
