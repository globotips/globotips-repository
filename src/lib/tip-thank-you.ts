export type TipThankYouPayMode = "demo" | "stripe" | "blocked";

export function tipThankYouCopy({
  name,
  payMode,
  stripeKind,
}: {
  name: string;
  payMode: TipThankYouPayMode;
  stripeKind: "test" | "live";
}): {
  eyebrow: string;
  heading: string;
  confirmation: string;
  detail: string;
  signoff: string;
  againLabel: string;
} {
  const confirmation = `${name} received your tip.`;

  if (payMode === "stripe" && stripeKind === "live") {
    return {
      eyebrow: "With gratitude",
      heading: "Thank you",
      confirmation,
      detail:
        "It went directly to them. You were not charged extra, and the hotel never holds the money.",
      signoff: "Travel Gratuity Group",
      againLabel: "Send another tip",
    };
  }

  if (payMode === "stripe") {
    return {
      eyebrow: "With gratitude",
      heading: "Thank you",
      confirmation,
      detail:
        "This was a test-mode payment. It would go directly to them, and you were not charged extra.",
      signoff: "Travel Gratuity Group",
      againLabel: "Send another tip",
    };
  }

  return {
    eyebrow: "With gratitude",
    heading: "Thank you",
    confirmation,
    detail:
      "This was a practice tip. No card was charged and no real money moved.",
    signoff: "Travel Gratuity Group",
    againLabel: "Send another demo tip",
  };
}

export function tipThankYouCopyMentionsBrand(text: string): boolean {
  return /globotips/i.test(text);
}
