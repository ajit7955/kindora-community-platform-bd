
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    image: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load the latest user information from the backend
  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("kindora_token");

      if (!token) {
        toast.error("Please login first.");
        router.replace("/login");
        return;
      }

      try {
        // Load cached information first
        const cachedUser = JSON.parse(
          localStorage.getItem("kindora_user") || "{}"
        );

        setUser({
          name: cachedUser.name || "",
          image: cachedUser.image || "",
          email: cachedUser.email || "",
        });

        // Fetch latest profile from database
        const result = await api("/auth/me", {
          method: "GET",
        });

        if (result.user) {
          setUser({
            name: result.user.name || "",
            image: result.user.image || "",
            email: result.user.email || "",
          });

          localStorage.setItem(
            "kindora_user",
            JSON.stringify(result.user)
          );
        }
      } catch (error) {
        toast.error(error.message || "Could not load profile.");

        if (
          error.message?.toLowerCase().includes("token") ||
          error.message?.toLowerCase().includes("unauthorized")
        ) {
          localStorage.removeItem("kindora_token");
          localStorage.removeItem("kindora_user");
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  // Update profile in the database
  async function saveProfile(e) {
    e.preventDefault();

    const name = user.name.trim();
    const image = user.image.trim();

    if (name.length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    try {
      setSaving(true);

      const result = await api("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          name,
          image: image || null,
        }),
      });

      if (!result.token || !result.user) {
        throw new Error("Invalid profile update response.");
      }

      // Save refreshed JWT token
      localStorage.setItem("kindora_token", result.token);

      // Save updated user information
      localStorage.setItem(
        "kindora_user",
        JSON.stringify(result.user)
      );

      setUser({
        name: result.user.name || "",
        image: result.user.image || "",
        email: result.user.email || "",
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Profile update failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container-x grid min-h-[60vh] place-items-center">
        <p className="font-semibold text-emerald-600">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="container-x py-14">
      <div className="mx-auto max-w-xl rounded-3xl border bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">

        <div className="mb-7">
          <p className="font-bold text-emerald-600">
            Account settings
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Your Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update your personal information.
          </p>
        </div>

        {/* Profile photo preview */}
        <div className="mb-7 flex items-center gap-4">
          {user.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="h-20 w-20 rounded-full border object-cover"
            />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-2xl font-black text-emerald-700">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div>
            <h2 className="font-bold">
              {user.name || "Your name"}
            </h2>

            <p className="text-sm text-slate-500">
              Kindora Member
            </p>
          </div>
        </div>

        <form onSubmit={saveProfile} className="grid gap-5">

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Full Name
            </label>

            <input
              type="text"
              required
              minLength={2}
              maxLength={80}
              value={user.name}
              onChange={(e) =>
                setUser({
                  ...user,
                  name: e.target.value,
                })
              }
              placeholder="Enter your full name"
              className="w-full rounded-xl border p-3 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Profile Photo URL
            </label>

            <input
              type="url"
              value={user.image}
              onChange={(e) =>
                setUser({
                  ...user,
                  image: e.target.value,
                })
              }
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-xl border p-3 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
            />

            <p className="mt-2 text-xs text-slate-500">
              Leave empty if you do not want a profile photo.
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Email Address
            </label>

            <input
              type="email"
              disabled
              value={user.email}
              className="w-full cursor-not-allowed rounded-xl border bg-slate-100 p-3 opacity-70 dark:border-slate-700 dark:bg-slate-950"
            />

            <p className="mt-2 text-xs text-slate-500">
              Email address cannot be changed here.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>

        </form>
      </div>
    </div>
  );
}
