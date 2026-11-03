"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!result.token || !result.user) {
        throw new Error("Login response is incomplete.");
      }

      localStorage.setItem("kindora_token", result.token);
      localStorage.setItem("kindora_user", JSON.stringify(result.user));

      toast.success("Login successful!");
      window.location.href = "/";
    } catch (error) {
      toast.error(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-12">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-soft dark:bg-slate-900 dark:border-slate-800">
        <p className="font-bold text-emerald-600">Welcome back</p>
        <h1 className="mt-2 text-3xl font-black">Sign in to Kindora</h1>
        <p className="mt-2 text-slate-500">Your next good deed is waiting.</p>

        <label className="mt-6 block text-sm font-semibold">Email</label>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border p-3 dark:bg-slate-950" placeholder="you@example.com" />

        <label className="mt-4 block text-sm font-semibold">Password</label>
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border p-3 dark:bg-slate-950" placeholder="Your password" />

        <button disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-50">
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          New here?{" "}
          <Link className="font-bold text-emerald-600" href="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
