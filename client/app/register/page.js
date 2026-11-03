"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || password.length < 6) {
      toast.error("Password needs uppercase, lowercase and at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const result = await api("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      if (!result.token || !result.user) {
        throw new Error("Registration response is incomplete.");
      }

      localStorage.setItem("kindora_token", result.token);
      localStorage.setItem("kindora_user", JSON.stringify(result.user));

      toast.success("Account created successfully!");
      window.location.href = "/";
    } catch (error) {
      toast.error(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-12">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-soft dark:bg-slate-900 dark:border-slate-800">
        <p className="font-bold text-emerald-600">Join the movement</p>
        <h1 className="mt-2 text-3xl font-black">Create your account</h1>

        <label className="mt-6 block text-sm font-semibold">Full Name</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border p-3 dark:bg-slate-950" placeholder="Your name" />

        <label className="mt-4 block text-sm font-semibold">Email</label>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border p-3 dark:bg-slate-950" placeholder="you@example.com" />

        <label className="mt-4 block text-sm font-semibold">Password</label>
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border p-3 dark:bg-slate-950" placeholder="At least 6 characters" />

        <button disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-50">
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already a member?{" "}
          <Link className="font-bold text-emerald-600" href="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
