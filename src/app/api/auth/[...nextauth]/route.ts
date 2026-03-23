import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// ✅ TypeScript fixed
export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username;
        const password = credentials?.password;

        if (
          username === process.env.MDM_ADMIN_USER &&
          password === process.env.MDM_ADMIN_PASS
        ) {
          return {
            id: "mdm-admin-1",
            name: "Mohd Muzaffar",
            email: "admin@example.com",
          };
        }
        console.log("Invalid credentials", username);
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,  // ✅ Explicit type
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };