import { LangChainTracer } from "langchain/callbacks";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function GET() {
  // You can set the project name for a specific tracer instance:
  console.log("Creating LangChainTracer instance", {
    projectName: process.env.LANGCHAIN_PROJECT,
  });

  const input = "What is the meaning of life?";

  const tracer = new LangChainTracer({ projectName: "My Project" });

  // Start chain
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful AI."],
    ["user", "{input}"],
  ]);
  const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
  const outputParser = new StringOutputParser();

  // Tags and metadata can be configured with RunnableConfig
  const chain = prompt
    .pipe(model)
    .pipe(outputParser)
    .withConfig({
      tags: ["top-level-tag"],
      metadata: { "top-level-key": "top-level-value" },
    });

  // Tags and metadata can also be passed at runtime
  await chain.invoke(
    { input },
    { tags: ["shared-tags"], metadata: { "shared-key": "shared-value" } }
  );

  // RUN
  // When tracing within LangChain, run names default to the class name of the traced object (e.g., 'ChatOpenAI').
  // (Note: this is not currently supported directly on LLM objects.)
  const configuredChain = chain.withConfig({ runName: "MyCustomChain" });
  await configuredChain.invoke({
    input,
    query: "What is the meaning of life?",
  });

  return Response.json({ hello: "world" });
}
