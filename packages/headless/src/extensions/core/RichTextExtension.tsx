import React from "react";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalEditor } from "lexical";
import { ReactNode } from "react";
import { BaseExtension } from "../base";
import { BaseExtensionConfig, ExtensionCategory } from "../types";
import { defaultLuthorTheme } from "../../core/theme";
import { EditorContext } from "../../core/createEditorSystem";

// Base RichText props interface - shared between config and component
export interface BaseRichTextProps {
  contentEditable?: React.ReactElement;
  placeholder?: React.ReactElement | string;
  className?: string;
  classNames?: {
    container?: string;
    contentEditable?: string;
    placeholder?: string;
  };
  styles?: {
    container?: React.CSSProperties;
    contentEditable?: React.CSSProperties;
    placeholder?: React.CSSProperties;
  };
  errorBoundary?: React.ComponentType<{
    children: React.JSX.Element;
    onError: (error: Error) => void;
  }>;
}

export interface RichTextConfig
  extends BaseExtensionConfig,
    BaseRichTextProps {}

// Shared component props - extends base props
type SharedRichTextProps = BaseRichTextProps;

const SharedRichText: React.FC<SharedRichTextProps> = (props) => {
  const {
    contentEditable,
    placeholder,
    className,
    classNames,
    styles,
    errorBoundary,
  } = props;
  const editorContext = React.useContext(EditorContext);
  const contextConfig = editorContext?.config as
    | {
        placeholder?: unknown;
        classNames?: BaseRichTextProps["classNames"];
        styles?: BaseRichTextProps["styles"];
      }
    | undefined;
  const configPlaceholder =
    typeof contextConfig?.placeholder === "string"
      ? contextConfig.placeholder
      : undefined;
  const configClassNames = contextConfig?.classNames;
  const configStyles = contextConfig?.styles;
  const resolvedPlaceholder = placeholder ?? configPlaceholder ?? "Start writing...";

  // Extract common placeholder props
  const placeholderClassNameFinal =
    classNames?.placeholder ||
    configClassNames?.placeholder ||
    defaultLuthorTheme.richText?.placeholder ||
    "luthor-placeholder";
  const placeholderStyle = {
    position: "absolute" as const,
    pointerEvents: "none" as const,
    zIndex: 1,
    ...configStyles?.placeholder,
    ...styles?.placeholder,
  };

  return (
    <div
      className={
        classNames?.container ||
        configClassNames?.container ||
        className ||
        defaultLuthorTheme.container ||
        "luthor-editor-container"
      }
      style={{
        position: "relative",
        ...configStyles?.container,
        ...styles?.container,
      }}
    >
      <RichTextPlugin
        contentEditable={
          contentEditable || (
            <div style={{ display: "block" }}>
              <ContentEditable
                className={
                  classNames?.contentEditable ||
                  configClassNames?.contentEditable ||
                  defaultLuthorTheme.richText?.contentEditable ||
                  "luthor-content-editable"
                }
                style={{
                  ...configStyles?.contentEditable,
                  ...styles?.contentEditable,
                }}
              />
            </div>
          )
        }
        placeholder={
          typeof resolvedPlaceholder === "string" ? (
            <div className={placeholderClassNameFinal} style={placeholderStyle}>
              {resolvedPlaceholder}
            </div>
          ) : (
            resolvedPlaceholder || (
              <div
                className={placeholderClassNameFinal}
                style={placeholderStyle}
              >
                Start writing...
              </div>
            )
          )
        }
        ErrorBoundary={errorBoundary || DefaultErrorBoundary}
      />
    </div>
  );
};

/**
 * RichTextExtension - Provides core rich text editing functionality
 * Extends BaseExtension to stay consistent with other extensions
 */
export class RichTextExtension extends BaseExtension<
  "richText",
  RichTextConfig,
  Record<string, never>,
  Record<string, never>,
  ReactNode[] // Plugins
> {
  constructor(config: RichTextConfig = {}) {
    super("richText", [ExtensionCategory.Floating]);
    this.config = {
      showInToolbar: false,
      position: "after", // RichText should render after children
      ...config,
    };
  }

  register(editor: LexicalEditor): () => void {
    void editor;
    // No registration needed for RichTextPlugin
    return () => {};
  }

  getPlugins(): ReactNode[] {
    return [<SharedRichText key="rich-text" {...this.config} />];
  }
}

// Preconfigured instance for convenience
export const richTextExtension = new RichTextExtension();

// Standalone RichText component for flexible usage
export type RichTextComponentProps = SharedRichTextProps;

export const RichText: React.FC<RichTextComponentProps> = (props) => {
  return <SharedRichText {...props} />;
};

// Default error boundary for RichTextPlugin
const DefaultErrorBoundary: React.FC<{
  children: React.JSX.Element;
  onError: (error: Error) => void;
}> = ({ children, onError }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("RichTextPlugin Error:", error);
    onError(error as Error);
    return (
      <div className="editor-error-boundary">
        <h3>Editor Error</h3>
        <p>Something went wrong with the editor. Please refresh the page.</p>
      </div>
    );
  }
};
