import select from "@inquirer/select";

import { Model } from "../types.js";

const ChatView = () => {
  const promptForUserMessage = () => {
    process.stdout.write("\nYou: ");
  };

  const displayNewChat = () => {
    console.log(
      "Welcome to Ollama! Type messages after the > prompt. Also, you can send a blank message to start a new thread\n"
    );
    promptForUserMessage();
  };

  const startAssistantMessage = () => {
    process.stdout.write("Assistant: ");
  };

  const displayAssistantToken = (message: string) => {
    const editedMessage = message.replaceAll("\n", "\n|\t");
    process.stdout.write(editedMessage);
  };

  const startListeningForUserInput = (
    onUserInput: (input: string) => Promise<void>
  ) => {
    process.stdin.on("data", async (data: Buffer) => {
      await onUserInput(data.toString().trim());
    });
  };

  const getModelChoice: () => Promise<Model> = () => {
    return select({
      message: "Select a model to use",
      choices: [
        {
          name: "Mixtral",
          value: "mixtral",
        },
        {
          name: "Mistral",
          value: "mistral",
        },
      ],
    })
      .then((model) => model as Model)
      .finally(() => process.stdin.resume());
  };

  return {
    displayNewChat,
    startListeningForUserInput,
    promptForUserMessage,
    startAssistantMessage,
    displayAssistantToken,
    getModelChoice,
  };
};

export default ChatView;
