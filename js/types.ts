import { Message as OllamaMessage } from "ollama";

export type Role = "system" | "user" | "assistant";
export type Model = "mistral" | "mixtral";
export type Message = OllamaMessage & { role: Role }; // add constraints to role to fit API

export type Thread = {
  messages: Message[];
};
