"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("https://api.buttondown.email/v1/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          tags: ["ai-blog"],
        }),
      });

      if (res.ok || res.status === 201) {
        setStatus("success");
        setMessage("Merci ! Vérifiez votre boîte mail pour confirmer.");
        setEmail("");
      } else {
        const data = await res.json();
        if (data.code === "email_already_exists") {
          setStatus("success");
          setMessage("Vous êtes déjà inscrit !");
        } else {
          throw new Error(data.detail || "Une erreur est survenue");
        }
      }
    } catch {
      setStatus("error");
      setMessage("Une erreur est survenue. Réessayez plus tard.");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  return (
    <div className="w-full">
      <p className="text-sm text-text-muted mb-4 leading-relaxed">
        Recevez les derniers articles dans votre boîte mail.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 input-field text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed px-6"
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Envoi...
            </span>
          ) : (
            "S'inscrire"
          )}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-sm ${
            status === "success" ? "text-accent" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
