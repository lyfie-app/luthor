import { forwardRef } from "react";
import {
  ExtensiveEditor,
  type ExtensiveEditorProps,
  type ExtensiveEditorRef,
} from "../extensive";

export type EmailEditorProps = Omit<
  ExtensiveEditorProps,
  "variantClassName" | "availableModes" | "initialMode" | "placeholder"
> & {
  placeholder?: string;
};

export const EmailEditor = forwardRef<ExtensiveEditorRef, EmailEditorProps>(
  ({ placeholder = "Write an email...", ...props }, ref) => {
    return (
      <ExtensiveEditor
        ref={ref}
        {...props}
        variantClassName="luthor-preset-email"
        availableModes={["visual", "html"]}
        initialMode="visual"
        placeholder={placeholder}
      />
    );
  },
);

EmailEditor.displayName = "EmailEditor";
