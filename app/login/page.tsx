"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import bannerImage from "../../Gemini_Generated_Image_kf4vfykf4vfykf4v (1).jpeg";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email")).toLowerCase().trim();
    const password = String(formData.get("password"));

    if (!email.endsWith(".edu.tr")) {
      setError("Sadece .edu.tr uzantılı üniversite e-postaları kabul edilir.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      setError("E-posta veya parola hatali.");
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="max-w-md space-y-6">
      <div className="flex items-center gap-3">
        <img src="/logo-mark.svg" alt="Campus Loop logo mark" className="h-9 w-9" />
        <div>
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-ink/70">Campus Loop hesabina giris yap.</p>
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
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="btn w-full" type="submit" disabled={loading}>
          {loading ? "Giris yapiliyor..." : "Login"}
        </button>
      </form>
      <p className="text-sm text-ink/70">
        Hesabiniz yok mu? <Link href="/register" className="text-accent">Register</Link>
      </p>
    </div>
  );
}
