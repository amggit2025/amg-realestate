'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Live Chat Component using Tawk.to
 * 
 * Setup Instructions:
 * 1. Go to https://www.tawk.to/ and create a free account
 * 2. Get your Property ID from Dashboard
 * 3. Replace TAWK_PROPERTY_ID and TAWK_WIDGET_ID in the environment variables
 * 4. Add to .env.local:
 *    NEXT_PUBLIC_TAWK_PROPERTY_ID=your_property_id
 *    NEXT_PUBLIC_TAWK_WIDGET_ID=your_widget_id
 */

export default function LiveChat() {
  const pathname = usePathname()
  const [isAdminPage, setIsAdminPage] = useState(true) // Default true to hide initially
  
  // Check if on admin page
  useEffect(() => {
    if (pathname) {
      setIsAdminPage(pathname.startsWith('/admin'))
    }
  }, [pathname])

  useEffect(() => {
    // Don't load on admin pages
    if (isAdminPage) {
      // Hide widget if already loaded
      // @ts-ignore
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        // @ts-ignore
        window.Tawk_API.hideWidget()
      }
      return
    }

    // Get Tawk.to credentials from environment variables
    const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID
    const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID

    // Don't load if credentials are not set
    if (!propertyId || !widgetId) {
      console.warn('⚠️ Tawk.to credentials not found. Please set NEXT_PUBLIC_TAWK_PROPERTY_ID and NEXT_PUBLIC_TAWK_WIDGET_ID in .env.local')
      return
    }

    // Show widget if already loaded
    // @ts-ignore
    if (window.Tawk_API && window.Tawk_API.showWidget) {
      // @ts-ignore
      window.Tawk_API.showWidget()
      return
    }

    // Load Tawk.to script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')
    
    document.body.appendChild(script)

    // Configure Tawk.to
    script.onload = () => {
      // @ts-ignore
      if (window.Tawk_API) {
        // Set language to Arabic
        // @ts-ignore
        window.Tawk_API.setAttributes({
          name: 'زائر',
          email: '',
          hash: ''
        }, (error: any) => {
          if (error) {
            console.error('Tawk.to error:', error)
          }
        })

        // Customize widget appearance
        // @ts-ignore
        window.Tawk_API.customStyle = {
          visibility: {
            desktop: {
              position: 'bl', // bottom-left (or 'br' for bottom-right)
              xOffset: 20,
              yOffset: 20
            },
            mobile: {
              position: 'bl',
              xOffset: 10,
              yOffset: 10
            }
          }
        }

        // Track when user starts chatting
        // @ts-ignore
        window.Tawk_API.onChatStarted = () => {
          console.log('💬 Chat started')
          // You can track this event in analytics
        }

        // Track when user sends a message
        // @ts-ignore
        window.Tawk_API.onChatMessageVisitor = (message: any) => {
          console.log('📨 Message sent:', message)
        }
      }
    }

    // Cleanup
    return () => {
      // Remove script when component unmounts
      const existingScript = document.querySelector(`script[src*="tawk.to"]`)
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
      
      // Remove Tawk widget
      // @ts-ignore
      if (window.Tawk_API) {
        try {
          // @ts-ignore
          window.Tawk_API.hideWidget()
        } catch (e) {
          // Silent fail
        }
      }
    }
  }, [isAdminPage])

  // This component doesn't render anything visible
  // The Tawk.to widget is injected directly into the page
  return null
}

/**
 * Alternative: Custom Live Chat Implementation
 * Uncomment below if you want to build your own chat system
 */

/*
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline'

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
}

export default function CustomLiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
      sender: 'agent',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages([...messages, newMessage])
    setInputMessage('')

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'شكراً لرسالتك! سيرد عليك أحد ممثلي خدمة العملاء قريباً.',
        sender: 'agent',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, agentResponse])
    }, 1000)
  }

  return (
    <>
      {/* Chat Button *\/}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/50 transition-shadow"
      >
        {isOpen ? (
          <XMarkIcon className="w-8 h-8" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-8 h-8" />
        )}
      </motion.button>

      {/* Chat Window *\/}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header *\/}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <h3 className="font-bold text-lg">دردشة مباشرة</h3>
              <p className="text-sm text-blue-100">نحن متاحون للمساعدة</p>
            </div>

            {/* Messages *\/}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString('ar-EG', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input *\/}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 px-4 py-2 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
*/
