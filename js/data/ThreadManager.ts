import { Message, Model, Thread } from "../types.js";
import OllamaClient from "../api/OllamaClient.js";

export type ThreadManagerProps = {
  model: Model;
};

export type ThreadManager = {
  startNewThread: () => void;
  respondToUserMessage: (
    input: string,
    onNextToken: (token: string) => void
  ) => Promise<void>;
};

const createThreadManager = ({ model }: ThreadManagerProps) => {
  const ollamaClient = OllamaClient({ model });

  const _createNewThread = () => {
    const thread: Thread = { messages: [] };
    return thread;
  };

  let currentThread: Thread = _createNewThread();

  const _recordUserMessage = (message: Message) => {
    currentThread.messages.push(message);
  };

  const _recordAssistantMessage = (message: Message) => {
    currentThread.messages.push(message);
  };

  const startNewThread = () => {
    currentThread = _createNewThread();
  };

  const respondToUserMessage = async (
    input: string,
    onNextToken: (token: string) => void
  ) => {
    _recordUserMessage({ role: "user", content: input });

    let assistantMessage = await ollamaClient.answerStreaming({
      messages: currentThread.messages,
      onNextToken: onNextToken,
    });
    _recordAssistantMessage(assistantMessage);
  };

  return { startNewThread, respondToUserMessage };
};

export default createThreadManager;
