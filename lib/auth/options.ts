/**
 * PWC 2030 Auth Configuration
 * NextAuth.js v4 configuration with extensibility for v5
 */

import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '../db'

// OAuth Provider Types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: 'STUDENT' | 'EMPLOYER' | 'MENTOR' | 'ADMIN'
      status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'DELETED'
    }
  }

  interface User {
    role: 'STUDENT' | 'EMPLOYER' | 'MENTOR' | 'ADMIN'
    status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  
  providers: [
    // LinkedIn OAuth (Primary)
    {
      id: 'linkedin',
      name: 'LinkedIn',
      type: 'oauth',
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      authorization: {
        url: 'https://www.linkedin.com/oauth/v2/authorization',
        params: { scope: 'r_emailaddress r_liteprofile' },
      },
      token: 'https://www.linkedin.com/oauth/v2/accessToken',
      userinfo: {
        url: 'https://api.linkedin.com/v2/me',
        async request({ tokens, provider }) {
          const profile = await fetch(provider.userinfo?.url as string, {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              'X-Restli-Protocol-Version': '2.0.0',
            },
          }).then(async (res) => await res.json())
          
          const email = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              'X-Restli-Protocol-Version': '2.0.0',
            },
          }).then(async (res) => await res.json())
          
          return {
            id: profile.id,
            name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
            email: email.elements?.[0]?.['handle~']?.emailAddress,
            image: profile.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier,
          }
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
          email: profile.email,
          image: profile.image,
        }
      },
    },

    // Google OAuth (Secondary)
    {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
      token: 'https://oauth2.googleapis.com/token',
      userinfo: 'https://www.googleapis.com/oauth2/v3/userinfo',
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
        }
      },
    },

    // GitHub OAuth (Developers)
    {
      id: 'github',
      name: 'GitHub',
      type: 'oauth',
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: { scope: 'read:user user:email' },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    },

    // Credentials (Email/Password)
    {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // This will be handled by the identity service
        // For now, return null to disable credentials auth
        return null
      },
    },
  ],

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour
  },

  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Allow all sign ins for now
      return true
    },

    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'STUDENT'
        token.status = (user as any).status || 'PENDING_VERIFICATION'
      }
      return token
    },

    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as any
        session.user.status = token.status as any
      }
      return session
    },
  },

  events: {
    async signIn({ user, account, isNewUser }) {
      // Update last login
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        }).catch(console.error)
      }
    },
  },

  // Security
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}
