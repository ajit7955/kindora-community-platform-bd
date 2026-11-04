
"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    // Name validation
    if (name.trim().length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    // Email validation
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    // Exactly 6 numeric digits
    if (!/^\d{6}$/.test(password)) {
      toast.error("Password must be exactly 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const result = await api("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      if (!result.token || !result.user) {
        throw new Error("Registration response is incomplete.");
      }

      localStorage.setItem("kindora_token", result.token);
      localStorage.setItem(
        "kindora_user",
        JSON.stringify(result.user)
      );

      toast.success("Account created successfully!");

      window.location.href = "/";
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-12">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-soft dark:bg-slate-900 dark:border-slate-800"
      >
        <p className="font-bold text-emerald-600">
          Join the movement
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Join Kindora and become part of the community.
        </p>

        {/* Full Name */}
        <label className="mt-6 block text-sm font-semibold">
          Full Name
        </label>

        <input
          required
          type="text"
          minLength={2}
          maxLength={80}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-xl border p-3 outline-none focus:border-emerald-500 dark:bg-slate-950"
          placeholder="Enter your full name"
        />

        {/* Email */}
        <label className="mt-4 block text-sm font-semibold">
          Email Address
        </label>

        <input
          required
          type="email"
          maxLength={150}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border p-3 outline-none focus:border-emerald-500 dark:bg-slate-950"
          placeholder="you@example.com"
        />

        {/* Six Digit Password */}
        <label className="mt-4 block text-sm font-semibold">
          Password (6 digits)
        </label>

        <input
          required
          type="password"
          inputMode="numeric"
          pattern="[0-9]{6}"
          minLength={6}
          maxLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setPassword(value);
          }}
          className="mt-2 w-full rounded-xl border p-3 outline-none focus:border-emerald-500 dark:bg-slate-950"
          placeholder="Enter 6 digit password"
        />

        <p className="mt-2 text-xs text-slate-500">
          Your password must contain exactly 6 numbers.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* Login Link */}
        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            className="font-bold text-emerald-600 hover:underline"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
