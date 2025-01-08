import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User as NextAuthUser } from "next-auth";
import { v4 as uuidv4 } from "uuid";

// Define custom types for the token
interface CustomToken {
  accessToken?: string;
  id?: string; // Make sure the ID is a string
  email?: string; // Make sure the ID is a string
  name?: string; // Make sure the ID is a string
}

type User = {
  email: string;
  username: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, username, password } = credentials;

        try {
          // const response = await fetch(
          //   `/api/sqlite/playermetrics2?username=${username}&password=${password}`
          // );

          const response = await fetch(
            `http://localhost:3000/api/sqlite/playermetrics2?username=${username}&password=${password}`
          );

          console.log(response);

          if (!response.ok) {
            throw new Error("Invalid response from API");
          }

          const result = await response.json();
          // const player_id = uuidv4();

          if (result.success) {
            // Ensure a user object is returned on successful login
            console.log("player_id auth.ts: ", result.data.player_id);
            console.log("player name auth.ts: ", result.data.username);
            console.log("player password auth.ts: ", result.data.password);

            return {
              id: result.data.player_id,
              name: result.data.username,
              email: result.data.email,
              password: result.data.password, // consider using hashed password if storing
            };
          } else {
            return null; // Login failed
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Check if it's a first sign-in
      if (account && profile) {
        // Assign the unique Google user identifier to the token
        token.id = profile.sub;

        // Optionally, store more info in the token (email, name, etc.)
        token.email = profile.email;
        token.name = profile.name;
        console.log("token id: ", token.id);
      }

      if (user) {
        // Use data from the `authorize` method
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        // token.password = user.password; // Include only if needed
      }
      // ---------------- basically gotta hard code the id to here for credentials --------------- --------------- ---------------

      // Non-OAuth login logic (credential-based login)
      // if (token.email && token.name && token.id === undefined) {
      //   const user: User = {
      //     email: token.email,
      //     username: token.name,
      //   };

      //   try {
      //     const response = await fetch(
      //       "http://localhost:3000/api/sqlite/playermetrics2/",
      //       {
      //         method: "POST",
      //         headers: {
      //           "Content-Type": "application/json", // Let server know you're sending JSON
      //         },
      //         body: JSON.stringify(user),
      //       }
      //     );
      //   } catch (error) {
      //     ("Error");
      //   }

      //   if (playerData) {
      //     token.id = playerData.player_id; // Assign the player_id from the database
      //     token.name = playerData.username ?? "Guest"; // Set name from database, fallback to "Guest"
      //     console.log("Non-OAuth token.id: ", token.id);
      //   } else {
      //     console.error("Player data not found.");
      //     return null; // Return null if no data is found
      //   }
      // }
      // ---------------- basically gotta hard code the id to here for credentials --------------- --------------- ---------------

      console.log("JWT Token", token); // Log token to inspect
      console.log("Authorize user:", user);
      return token;
    },
    async session({ session, token }) {
      // TypeScript will know `token` is of type `CustomToken`

      if (token?.id) {
        session.user.id = token.id as string; // Ensure the ID is a string
        console.log("session.user.id auth.ts: ", token.id);
        session.user.email = (token.email as string) ?? ""; // Ensure the ID is a string
        session.user.name = (token.name as string) ?? "Guest"; // Ensure the ID is a string
      }

      return session;
    },
  },
  session: {
    strategy: "jwt", // You can choose session strategy (JWT or database-backed)
  },
});
