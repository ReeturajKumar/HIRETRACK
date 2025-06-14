/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY in environment");
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const model = "gemini-1.5-flash";
    const config = {
      responseMimeType: "text/plain",
    };

    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let result = "";
    for await (const chunk of response) {
      result += chunk.text || "";
    }
    console.log(result);

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("[AI_ERROR]", error?.message || error);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
