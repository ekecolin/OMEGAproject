// Defines a custom type 'Message' for use in TypeScript-enabled applications.
export type Message = {
  role: "user" | "assistant";
  content: string;
};
