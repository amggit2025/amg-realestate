// JWT Utilities for Admin Authentication
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// JWT Secret Keys
if (!process.env.JWT_ADMIN_SECRET) {
  throw new Error('JWT_ADMIN_SECRET is not configured')
}

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d'

// Admin Token Payload Interface
export interface AdminTokenPayload {
  id: string
  username: string
  email: string
  role: string
  permissions?: any
}

// Admin JWT Functions
export class AdminAuth {
  
  // Generate Access Token
  static generateAccessToken(payload: AdminTokenPayload): string {
    return jwt.sign(payload, JWT_ADMIN_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'amg-real-estate',
      audience: 'admin'
    } as jwt.SignOptions)
  }

  // Generate Refresh Token
  static generateRefreshToken(adminId: string, tokenVersion: number): string {
    return jwt.sign(
      { adminId, tokenVersion },
      JWT_ADMIN_SECRET as string,
      {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
        issuer: 'amg-real-estate',
        audience: 'admin-refresh'
      } as jwt.SignOptions
    )
  }

  // Verify Access Token
  static verifyAccessToken(token: string): AdminTokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_ADMIN_SECRET as string, {
        issuer: 'amg-real-estate',
        audience: 'admin'
      }) as AdminTokenPayload
      return decoded
    } catch (error) {
      return null
    }
  }

  // Verify Refresh Token
  static verifyRefreshToken(token: string): { adminId: string; tokenVersion: number } | null {
    try {
      const decoded = jwt.verify(token, JWT_ADMIN_SECRET as string, {
        issuer: 'amg-real-estate',
        audience: 'admin-refresh'
      }) as { adminId: string; tokenVersion: number }
      return decoded
    } catch (error) {
      return null
    }
  }

  // Hash Password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  }

  // Verify Password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  // Generate Secure Random Token
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

// Admin Permissions System
export class AdminPermissions {
  
  // Default Admin Permissions
  static readonly PERMISSIONS = {
    SUPER_ADMIN: {
      users: { read: true, write: true, delete: true },
      properties: { read: true, write: true, delete: true },
      projects: { read: true, write: true, delete: true },
      inquiries: { read: true, write: true, delete: true },
      admins: { read: true, write: true, delete: true },
      system: { read: true, write: true, delete: true }
    },
    ADMIN: {
      users: { read: true, write: true, delete: true },
      properties: { read: true, write: true, delete: true },
      projects: { read: true, write: true, delete: true },
      inquiries: { read: true, write: true, delete: true },
      admins: { read: true, write: false, delete: false },
      system: { read: true, write: false, delete: false }
    },
    MODERATOR: {
      users: { read: true, write: true, delete: false },
      properties: { read: true, write: true, delete: false },
      projects: { read: true, write: true, delete: false },
      inquiries: { read: true, write: true, delete: false },
      admins: { read: false, write: false, delete: false },
      system: { read: true, write: false, delete: false }
    },
    SUPPORT: {
      users: { read: true, write: false, delete: false },
      properties: { read: true, write: false, delete: false },
      projects: { read: true, write: false, delete: false },
      inquiries: { read: true, write: true, delete: false },
      admins: { read: false, write: false, delete: false },
      system: { read: true, write: false, delete: false }
    }
  }

  // Check Permission
  static hasPermission(
    adminRole: string,
    resource: string,
    action: 'read' | 'write' | 'delete',
    customPermissions?: any
  ): boolean {
    // Use custom permissions if provided
    if (customPermissions && customPermissions[resource]) {
      return customPermissions[resource][action] || false
    }

    // Use default role permissions
    const rolePermissions = this.PERMISSIONS[adminRole as keyof typeof this.PERMISSIONS]
    if (!rolePermissions || !rolePermissions[resource as keyof typeof rolePermissions]) {
      return false
    }

    return rolePermissions[resource as keyof typeof rolePermissions][action] || false
  }

  // Get All Permissions for Role
  static getRolePermissions(adminRole: string): any {
    return this.PERMISSIONS[adminRole as keyof typeof this.PERMISSIONS] || {}
  }
}

// Helper function for API routes to verify admin token
export async function verifyAdminToken(request: Request): Promise<{ isValid: boolean; admin?: AdminTokenPayload; error?: string }> {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('authorization')
    let token: string | null = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      // Check cookies if no Bearer token
      const cookies = request.headers.get('cookie')
      if (cookies) {
        // Try both cookie names
        const cookieMatch = cookies.match(/admin_token=([^;]+)/) || cookies.match(/admin-token=([^;]+)/)
        if (cookieMatch) {
          token = cookieMatch[1]
        }
      }
    }

    if (!token) {
      return { isValid: false, error: 'No token provided' }
    }

    const admin = AdminAuth.verifyAccessToken(token)
    if (!admin) {
      return { isValid: false, error: 'Invalid token' }
    }

    return { isValid: true, admin }
  } catch (error) {
    return { isValid: false, error: 'Token verification failed' }
  }
}
