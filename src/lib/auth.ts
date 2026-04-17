import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import type { Adapter } from "next-auth/adapters";

const ADMIN_CODE = "150803";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        code: { label: "Code", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.code) return null;
        if (credentials.code !== ADMIN_CODE) return null;

        const user = await prisma.user.findFirst();
        if (!user) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
};
