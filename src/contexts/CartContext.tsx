'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Types
export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  color?: string
  category: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemsCount: () => number
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('amg-cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('amg-cart', JSON.stringify(items))
    }
  }, [items, isLoaded])

  // Add item to cart
  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.color === product.color
      )

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.id === product.id && item.color === product.color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity }]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  // Update item quantity
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  // Clear entire cart
  const clearCart = () => {
    setItems([])
  }

  // Get total price
  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Get total items count
  const getItemsCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom Hook
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
