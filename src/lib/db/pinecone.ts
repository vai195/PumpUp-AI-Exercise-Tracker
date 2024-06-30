import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw Error("PINECONE_API_KEY is required");
}

const pinecone = new Pinecone({
  apiKey,
});

export const exerciseIndex = pinecone.Index("nextjs-workout-ai-tracker");
