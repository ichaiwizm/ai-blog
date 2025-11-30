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
      // Buttondown API integration
      // Replace YOUR_BUTTONDOWN_USERNAME with your actual Buttondown username
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

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  return (
    <div className="w-full">
      <div className="font-mono text-xs text-[var(--text-muted)] mb-3">
        <span className="text-[var(--accent)]">&gt;</span> Newsletter
      </div>
      <p className="font-serif text-sm text-[var(--text-secondary)] mb-4">
        Recevez les derniers articles directement dans votre boite mail.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-2 bg-[var(--accent)] text-[var(--bg-primary)] font-mono text-sm font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Envoi...
            </>
          ) : (
            "S'inscrire"
          )}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 font-mono text-xs ${
            status === "success" ? "text-[var(--accent)]" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
