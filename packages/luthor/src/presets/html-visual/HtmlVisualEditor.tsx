import { forwardRef } from "react";
import {
  ExtensiveEditor,
  type ExtensiveEditorProps,
  type ExtensiveEditorRef,
} from "../extensive";

export type HtmlVisualEditorProps = Omit<
  ExtensiveEditorProps,
  "variantClassName" | "availableModes" | "initialMode" | "placeholder"
> & {
  placeholder?: string;
};

export const HtmlVisualEditor = forwardRef<
  ExtensiveEditorRef,
  HtmlVisualEditorProps
>(({ placeholder = "Compose with HTML preview...", ...props }, ref) => {
  return (
    <ExtensiveEditor
      ref={ref}
      {...props}
      variantClassName="luthor-preset-html-visual"
      availableModes={["visual", "html"]}
      initialMode="html"
      placeholder={placeholder}
    />
  );
});

HtmlVisualEditor.displayName = "HtmlVisualEditor";
