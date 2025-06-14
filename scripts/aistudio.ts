export default async function getGenerativeAIResponse(prompt: string): Promise<string> {
  const res = await fetch("/api/aistudio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate response");
  }

  const data = await res.json();
  return data.result;
}

