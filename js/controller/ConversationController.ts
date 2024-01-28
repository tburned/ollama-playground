import ChatView from "../view/ChatView.js";
import createThreadManager, { ThreadManager } from "../data/ThreadManager.js";

const ConversationController = async () => {
  const view = ChatView();

  const model = await view.getModelChoice();
  const threadManager = createThreadManager({ model });

  const newThread = () => {
    threadManager.startNewThread();
    view.displayNewChat();
  };

  const handleUserMessage = async (userInput: string) => {
    view.startAssistantMessage();
    await threadManager.respondToUserMessage(
      userInput,
      view.displayAssistantToken
    );
    view.promptForUserMessage();
  };

  const start = () => {
    newThread();
    view.startListeningForUserInput(async (userInput) => {
      if (userInput === "") {
        newThread();
      } else {
        await handleUserMessage(userInput);
      }
    });
  };

  return { start };
};

export default ConversationController;
