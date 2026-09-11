"use client";

import { useState } from "react";
import { IconStar } from "./Icons";

export default function ReviewForm() {
  const [form, setForm] = useState({ author: "", neighborhood: "", text: "", rating: 0, website: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.rating) {
      setErrorMsg("Please choose a star rating.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message !== "failed" ? err.message : "");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-line bg-gold-soft p-8 text-center">
        <div className="mb-1 font-display text-xl font-bold uppercase text-ink">Thank you!</div>
        <p className="text-sm text-ink-soft">
          Your review has been submitted. Michael reviews each one personally — it'll appear here shortly.
        </p>
      </div>
    );
  }

  const fieldClass =
    "rounded-[3px] border border-line px-4 py-3 text-[15px] outline-none transition focus:border-ink";

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg flex-col gap-3.5 border border-line bg-white p-7">
      <div className="mb-1 text-center">
        <div className="font-display text-xl font-bold uppercase text-ink">Share your experience</div>
        <p className="mt-1 text-[13px] text-ink-faint">Worked with us? Leave a review — it means a lot.</p>
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="hp_company"
        tabIndex={-1}
        autoComplete="new-password"
        value={form.website}
        onChange={(e) => update("website", e.target.value)}
        className="absolute h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="flex flex-col items-center gap-2 py-1">
        <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHoverRating(n)}
              onClick={() => update("rating", n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className="p-0.5"
            >
              <IconStar
                className={`h-7 w-7 transition ${
                  n <= (hoverRating || form.rating) ? "text-gold" : "text-line"
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-ink-faint">
          {form.rating ? `${form.rating} out of 5` : "Tap to rate"}
        </span>
      </div>

      <input
        required
        placeholder="Your name"
        value={form.author}
        onChange={(e) => update("author", e.target.value)}
        className={fieldClass}
      />
      <input
        placeholder="Neighborhood or city (optional)"
        value={form.neighborhood}
        onChange={(e) => update("neighborhood", e.target.value)}
        className={fieldClass}
      />
      <textarea
        required
        rows={4}
        placeholder="What was your experience like?"
        value={form.text}
        onChange={(e) => update("text", e.target.value)}
        className={fieldClass}
      />

      <button type="submit" disabled={status === "sending"} className="btn-primary mt-1 justify-center disabled:opacity-60">
        {status === "sending" ? "Submitting…" : "Submit review"}
      </button>
      {status === "error" && (
        <div className="text-sm font-semibold text-red-600">
          {errorMsg || "Something went wrong. Please try again."}
        </div>
      )}
    </form>
  );
}
