import { ChatOpenAI } from "@langchain/openai";
import { LangChainTracer } from "@langchain/core/tracers/tracer_langchain";
import { Client } from "langsmith";

export async function GET() {
  const llm = new ChatOpenAI();
  const client = new Client({
    // hideInputs: (inputs) => ({}),
    // hideOutputs: (outputs) => ({}),
    hideInputs: true,
    // hideOutputs: true,
  });
  const tracer = new LangChainTracer({ client });
  // The traced run will have its metadata present, but the inputs will be hidden
  await llm.invoke("Say foo", { callbacks: [tracer] });

  const unfilteredTracer = new LangChainTracer();
  // The traced run will not have hidden inputs and outputs
  await llm.invoke("Say bar", { callbacks: [unfilteredTracer] });

  return Response.json({ hello: "world" });
}
