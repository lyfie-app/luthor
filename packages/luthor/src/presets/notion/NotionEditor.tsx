import { forwardRef } from "react";
import {
  ExtensiveEditor,
  type ExtensiveEditorProps,
  type ExtensiveEditorRef,
} from "../extensive";

export type NotionEditorProps = Omit<
  ExtensiveEditorProps,
  "variantClassName" | "placeholder"
> & {
  placeholder?: string;
};

export const NotionEditor = forwardRef<ExtensiveEditorRef, NotionEditorProps>(
  ({ placeholder = "Type '/' for commands...", ...props }, ref) => {
    return (
      <ExtensiveEditor
        ref={ref}
        {...props}
        variantClassName="luthor-preset-notion"
        placeholder={placeholder}
      />
    );
  },
);

NotionEditor.displayName = "NotionEditor";
