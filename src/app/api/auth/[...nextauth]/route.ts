/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        if (!user.active) {
          throw new Error("Account is deactivated");
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          }) as any;

          if (existingUser) {
            // Update existing user with provider ID if not set
            const updateData: any = {
              avatar: user.image,
              emailVerified: true,
              verified: true,
            };

            if (account.provider === "google" && !existingUser.googleId) {
              updateData.googleId = account.providerAccountId;
              updateData.provider = "google";
            } else if (account.provider === "facebook" && !existingUser.facebookId) {
              updateData.facebookId = account.providerAccountId;
              updateData.provider = "facebook";
            }

            await (prisma.user as any).update({
              where: { email: user.email! },
              data: updateData,
            });
          } else {
            // Create new user from OAuth profile
            const names = user.name?.split(" ") || ["", ""];
            const firstName = names[0] || "User";
            const lastName = names.slice(1).join(" ") || "";

            const createData: any = {
              email: user.email!,
              firstName,
              lastName,
              avatar: user.image,
              provider: account.provider,
              emailVerified: true,
              verified: true,
            };

            if (account.provider === "google") {
              createData.googleId = account.providerAccountId;
            } else if (account.provider === "facebook") {
              createData.facebookId = account.providerAccountId;
            }

            await (prisma.user as any).create({
              data: createData,
            });
          }

          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      if (account?.provider === "google" || account?.provider === "facebook") {
        // Fetch full user details from database
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.userType = dbUser.userType;
          token.verified = dbUser.verified;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        
        // Fetch latest user data
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            userType: true,
            verified: true,
            active: true,
          },
        });

        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser.id,
            email: dbUser.email,
            name: `${dbUser.firstName} ${dbUser.lastName}`,
            image: dbUser.avatar,
            userType: dbUser.userType,
            verified: dbUser.verified,
          };
        }
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
