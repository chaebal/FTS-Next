"use server";

import { signIn, signOut, auth } from "@/auth";
import { redirect } from "next/navigation";
import Login from "@/app/login/page";

export async function handleSignIn() {
  //   console.log("Sign-in button clicked");
  await signIn("google", { redirectTo: "/secret" });

  //   await signIn("google");
  //   redirect("/secret"); // Explicitly redirect to "/secret"
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });

  //   await signOut();
  //   redirect("/"); // Explicitly redirect to "/"
}
