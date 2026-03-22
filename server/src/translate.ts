import fetch from "node-fetch";

const translationCache = new Map<string, string>();

type TranslateResponse = {
  data?: {
    translations?: Array<{
      translatedText?: string;
    }>;
  };
  error?: {
    message?: string;
  };
};

export async function translateTexts(
  texts: string[],
  target: string,
  apiKey: string
): Promise<string[]> {
  if (!apiKey || target.toLowerCase() === "vi") {
    return texts;
  }

  const output = [...texts];
  const missingIndexes: number[] = [];
  const missingTexts: string[] = [];

  texts.forEach((text, index) => {
    const key = `${target}:${text}`;
    const cached = translationCache.get(key);
    if (cached) {
      output[index] = cached;
    } else {
      missingIndexes.push(index);
      missingTexts.push(text);
    }
  });

  if (!missingTexts.length) {
    return output;
  }

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: missingTexts,
        target,
        format: "text",
      }),
    }
  );

  const data = (await response.json()) as TranslateResponse;
  if (!response.ok || !data.data?.translations) {
    throw new Error(data.error?.message || "Google Translate request failed");
  }

  data.data.translations.forEach((item, i) => {
    const translated = item.translatedText || missingTexts[i];
    const originalIndex = missingIndexes[i];
    output[originalIndex] = translated;
    translationCache.set(`${target}:${missingTexts[i]}`, translated);
  });

  return output;
}
