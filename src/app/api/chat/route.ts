import { exerciseIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { openai as oAI } from "@ai-sdk/openai";

import { ChatCompletionMessage } from "openai/resources/index.mjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTrucated = messages.slice(-6);
    console.log("Truncated Messages: " + messagesTrucated);

    const embedding = await getEmbedding(
      messagesTrucated.map((message) => message.content).join("\n")
    );
    const { userId } = auth();

    const vectorQueryResponse = await exerciseIndex.query({
      vector: embedding,
      topK: 5,
      filter: { userId },
    });

    const releventExercises = await prisma.exercise.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "You are an intelligent exercise tracker app, You answer the user's questions based on their existing exercises and values they keep track of everyday on this app as well as health and fitness questions in general and can give exercise suggestions" +
        "The relevent exercises for this query are:\n" +
        releventExercises
          .map(
            (exercise) =>
              `Name: ${exercise.name}\n\nReps: ${exercise.reps}\n\nSets: ${exercise.sets}\n\nWeight: ${exercise.weight}\n\n Completed: ${exercise.completed}\n\n Date: ${exercise.created_at}`
          )
          .join("\n\n"),
    };
    // openai.chat.completions.create
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTrucated],
    });

    const stream = OpenAIStream(response);
    // return response.pipeTextStreamToResponse;
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
