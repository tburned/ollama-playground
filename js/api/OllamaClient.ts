import { Message, Model } from "../types.js";
import ollama from "ollama";

type BaseAnswerParams = {
  model: Model;
  messages: Message[];
};

type StreamingAnswerParams = BaseAnswerParams & {
  onNextToken?: (token: string) => void;
};

type TransactionalAnswerParams = BaseAnswerParams;

type OllamaClientProps = {
  model: Model;
};

const answerUserMessage: (
  params: StreamingAnswerParams
) => Promise<Message> = async ({
  model,
  messages,
  onNextToken = (__ignored) => {},
}: StreamingAnswerParams) => {
  const response = await ollama.chat({
    model,
    messages,
    stream: true,
  });
  let modelResponse = "";
  for await (const chatResponse of response) {
    modelResponse += chatResponse.message.content;
    onNextToken(chatResponse.message.content);
  }
  return { role: "assistant", content: modelResponse };
};

const answerUserMessageTransactionally: (
  params: TransactionalAnswerParams
) => Promise<Message> = async ({ model, messages }: StreamingAnswerParams) => {
  const response = await ollama.chat({
    model,
    messages,
    stream: false,
  });
  return { role: "assistant", content: response.message.content };
};

const OllamaClient = ({ model }: OllamaClientProps) => ({
  answerStreaming: (params: Omit<StreamingAnswerParams, "model">) =>
    answerUserMessage({ model, ...params }),
  answerTransactionally: (params: Omit<TransactionalAnswerParams, "model">) =>
    answerUserMessageTransactionally({ model, ...params }),
});

export default OllamaClient;
