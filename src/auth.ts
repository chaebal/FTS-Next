import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Define custom types for the token
interface CustomToken {
  accessToken?: string;
  id?: string; // Make sure the ID is a string
  email?: string; // Make sure the ID is a string
  name?: string; // Make sure the ID is a string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Check if it's a first sign-in
      if (account && profile) {
        // Assign the unique Google user identifier to the token
        token.id = profile.sub;

        // Optionally, store more info in the token (email, name, etc.)
        token.email = profile.email;
        token.name = profile.name;
      }
      return token;
    },
    async session({ session, token }) {
      // TypeScript will know `token` is of type `CustomToken`

      if (token?.id) {
        session.user.id = token.id as string; // Ensure the ID is a string
        session.user.email = (token.email as string) ?? ""; // Ensure the ID is a string
        session.user.name = (token.name as string) ?? "Guest"; // Ensure the ID is a string
      }

      return session;
    },
  },
});
