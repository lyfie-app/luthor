import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getJSONBMock = vi.fn(() => "{\"root\":{\"children\":[]}}");

vi.mock("../extensive", async () => {
  const react = await import("react");
  const ExtensiveEditor = react.forwardRef(function MockExtensiveEditor(
    props: { children?: ReactNode },
    ref: react.ForwardedRef<{ getJSONB: () => string }>,
  ) {
    react.useImperativeHandle(ref, () => ({ getJSONB: getJSONBMock }));
    return <div data-testid="chat-extensive-editor">{props.children}</div>;
  });

  return {
    ExtensiveEditor,
  };
});

import { ChatWindowEditor } from "./ChatWindowEditor";

describe("ChatWindowEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits on Enter by default", () => {
    const onSend = vi.fn();
    const { container } = render(<ChatWindowEditor onSend={onSend} showDefaultContent={false} />);

    const wrapper = container.querySelector(".luthor-preset-chat-window") as HTMLElement;
    fireEvent.keyDown(wrapper, { key: "Enter" });

    expect(onSend).toHaveBeenCalledWith({ jsonb: "{\"root\":{\"children\":[]}}" });
  });

  it("keeps Shift+Enter when allowShiftEnter is true", () => {
    const onSend = vi.fn();
    const { container } = render(
      <ChatWindowEditor onSend={onSend} showDefaultContent={false} allowShiftEnter />,
    );

    const wrapper = container.querySelector(".luthor-preset-chat-window") as HTMLElement;
    fireEvent.keyDown(wrapper, { key: "Enter", shiftKey: true });

    expect(onSend).not.toHaveBeenCalled();
  });

  it("fires callback from send button", () => {
    const onSend = vi.fn();
    render(<ChatWindowEditor onSend={onSend} showDefaultContent={false} />);

    fireEvent.click(screen.getByTestId("chat-send-button"));

    expect(onSend).toHaveBeenCalledTimes(1);
  });
});
