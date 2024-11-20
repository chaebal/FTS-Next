"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <main className="bg-[#26313c] h-screen flex items-center justify-center p-10">
      <div className="grid box-animate w-full h-full grid-cols-1 bg-white md:grid-cols-2">
        <div className="bg-[#16202a] text-white flex items-center justify-center flex-col">
          <div className="my-4 relative w-80 h-40">
            <Image
              className="object-cover"
              src="/assets/qyve-logo.png"
              alt="Background image"
              fill={true}
            />
          </div>
          <div className="w-[171.5px] h-[60px]">
            <Button
              className="flex mb-4 w-full h-[75%] items-center gap-1 px-12 bg-transparent rounded-full"
              variant="outline"
              onClick={() => {
                signIn("google", { callbackUrl: "/secret" });
              }}
            >
              <FcGoogle /> Google Sign In
            </Button>
          </div>
          <form>
            <Label htmlFor="email">Email</Label>
            <Input
              className="mt-2 mb-4 bg-transparent rounded-full"
              type="email"
              id="email"
              placeholder="Email"
            />
            <Label htmlFor="email">Password</Label>
            <Input
              className="mt-2 mb-4 bg-transparent rounded-full"
              type="password"
              id="password"
              placeholder="Password"
            />
            <Button
              type="submit"
              className="w-full mt-6 bg-indigo-700 rounded-full hover:bg-indigo-500"
            >
              Login
            </Button>
          </form>
          <p className="mt-4 text-xs text-slate-200">
            @2024 All rights reserved
          </p>
        </div>

        <div className="relative hidden md:block">
          <Image
            className="object-cover"
            fill={true}
            src="/assets/qyve-logo.png"
            alt="Background image"
          />
        </div>
      </div>
    </main>
  );
}
