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
        setMessage("Merci ! Verifiez votre boite mail pour confirmer.");
        setEmail("");
      } else {
        const data = await res.json();
        if (data.code === "email_already_exists") {
          setStatus("success");
          setMessage("Vous etes deja inscrit !");
        } else {
          throw new Error(data.detail || "Une erreur est survenue");
        }
      }
    } catch {
      setStatus("error");
      setMessage("Une erreur est survenue. Reessayez plus tard.");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  return (
    <div className="w-full">
      <h4 className="font-body text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">
        Newsletter
      </h4>
      <p className="text-sm text-text-muted mb-4">
        Recevez les derniers articles dans votre boite mail.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 brutal-input border-r-0 sm:border-r-0 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="brutal-btn whitespace-nowrap disabled:opacity-50"
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
          className={`mt-3 font-mono text-xs ${
            status === "success" ? "text-accent" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
