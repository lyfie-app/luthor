import { forwardRef } from "react";
import {
  ExtensiveEditor,
  type ExtensiveEditorProps,
  type ExtensiveEditorRef,
} from "../extensive";

export type MarkdownVisualEditorProps = Omit<
  ExtensiveEditorProps,
  "variantClassName" | "availableModes" | "initialMode" | "placeholder"
> & {
  placeholder?: string;
};

export const MarkdownVisualEditor = forwardRef<
  ExtensiveEditorRef,
  MarkdownVisualEditorProps
>(({ placeholder = "Write in markdown...", ...props }, ref) => {
  return (
    <ExtensiveEditor
      ref={ref}
      {...props}
      variantClassName="luthor-preset-markdown-visual"
      availableModes={["visual", "markdown"]}
      initialMode="markdown"
      placeholder={placeholder}
    />
  );
});

MarkdownVisualEditor.displayName = "MarkdownVisualEditor";
