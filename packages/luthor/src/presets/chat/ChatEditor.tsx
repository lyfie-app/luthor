import { forwardRef } from "react";
import {
  ExtensiveEditor,
  type ExtensiveEditorProps,
  type ExtensiveEditorRef,
} from "../extensive";

export type ChatEditorProps = Omit<
  ExtensiveEditorProps,
  "variantClassName" | "availableModes" | "initialMode" | "placeholder"
> & {
  placeholder?: string;
};

export const ChatEditor = forwardRef<ExtensiveEditorRef, ChatEditorProps>(
  ({ placeholder = "Write a message...", ...props }, ref) => {
    return (
      <ExtensiveEditor
        ref={ref}
        {...props}
        variantClassName="luthor-preset-chat"
        availableModes={["visual", "markdown"]}
        initialMode="visual"
        placeholder={placeholder}
      />
    );
  },
);

ChatEditor.displayName = "ChatEditor";
