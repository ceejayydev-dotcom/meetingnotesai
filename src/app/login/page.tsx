"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert("Check your email for a login link!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Login with Magic Link</h1>
      <form onSubmit={handleLogin}>
        <input
          className="border p-2 mr-2"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">
          Send Link
        </button>
      </form>
    </div>
  );
}
