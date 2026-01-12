"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import bannerImage from "../../Gemini_Generated_Image_kf4vfykf4vfykf4v (1).jpeg";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email")).toLowerCase().trim();

    if (!email.endsWith(".edu.tr")) {
      setError("Sadece .edu.tr uzantılı üniversite e-postaları kabul edilir.");
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.get("name"),
      email,
      password: formData.get("password"),
      university: formData.get("university")
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Kayit basarisiz.");
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="max-w-md space-y-6">
      <div className="flex items-center gap-3">
        <img src="/logo-mark.svg" alt="Campus Loop logo mark" className="h-9 w-9" />
        <div>
          <h1 className="text-2xl font-semibold">Register</h1>
          <p className="text-sm text-ink/70">Yeni Campus Loop hesabini olustur.</p>
        </div>
      </div>
      <Image
        src={bannerImage}
        alt="Campus Loop banner"
        className="w-full max-w-md rounded-3xl border border-black/10 shadow-sm"
        priority
      />
      <form onSubmit={handleSubmit} className="space-y-4 card">
        <div className="space-y-2">
          <label className="label" htmlFor="name">
            Name
          </label>
          <input className="input" id="name" name="name" type="text" required />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input className="input" id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input className="input" id="password" name="password" type="password" required />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="university">
            University (optional)
          </label>
          <input className="input" id="university" name="university" type="text" />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? (
          <p className="text-sm text-green-600">
            Kayit tamamlandi. <Link href="/login">Login</Link>
          </p>
        ) : null}
        <button className="btn w-full" type="submit" disabled={loading}>
          {loading ? "Kayit yapiliyor..." : "Register"}
        </button>
      </form>
    </div>
  );
}
