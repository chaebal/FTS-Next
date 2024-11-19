"use client";

import Image from "next/image";
import { NextUIProvider } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

export default function Home() {
  // const router = useRouter;
  return (
    <div>
      <h1>Homepage</h1>
      <Link href="/login">Sign In Page</Link>
    </div>
  );
}
