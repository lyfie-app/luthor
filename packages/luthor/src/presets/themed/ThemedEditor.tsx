import { forwardRef } from "react";
import {
  ExtensiveEditor,
  type ExtensiveEditorProps,
  type ExtensiveEditorRef,
} from "../extensive";

export type ThemedEditorProps = Omit<
  ExtensiveEditorProps,
  "variantClassName" | "placeholder"
> & {
  placeholder?: string;
};

export const ThemedEditor = forwardRef<ExtensiveEditorRef, ThemedEditorProps>(
  ({ placeholder = "Start writing with theme tokens...", ...props }, ref) => {
    return (
      <ExtensiveEditor
        ref={ref}
        {...props}
        variantClassName="luthor-preset-themed"
        placeholder={placeholder}
      />
    );
  },
);

ThemedEditor.displayName = "ThemedEditor";
