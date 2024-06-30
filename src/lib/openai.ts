import OpenAI from "openai";

const apiKey = process.env.OPEN_AI_API_KEY;

if (!apiKey) {
  throw new Error("OPEN_AI_API_KEY environment variable not found");
}

const openai = new OpenAI({ apiKey });

export default openai;

export async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  const embedding = response.data[0].embedding;

  if (!embedding) {
    throw new Error("Failed to generating embedding");
  }
  console.log(embedding);
  return embedding;
}
