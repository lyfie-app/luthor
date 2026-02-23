import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { extensiveEditorMock } = vi.hoisted(() => ({
  extensiveEditorMock: vi.fn(() => null),
}));

vi.mock("../extensive", () => ({
  ExtensiveEditor: extensiveEditorMock,
}));

import { EmailComposeEditor } from "./EmailComposeEditor";

describe("EmailComposeEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header rows based on visibility toggles", () => {
    render(<EmailComposeEditor showDefaultContent={false} showCc showBcc />);

    expect(screen.getByTestId("email-row-to")).toBeInTheDocument();
    expect(screen.getByTestId("email-row-cc")).toBeInTheDocument();
    expect(screen.getByTestId("email-row-bcc")).toBeInTheDocument();
    expect(screen.getByTestId("email-row-subject")).toBeInTheDocument();
  });

  it("wires moderate body feature defaults", () => {
    render(<EmailComposeEditor showDefaultContent={false} />);

    const props = extensiveEditorMock.mock.calls.at(-1)?.[0] as Record<string, unknown>;
    const featureFlags = props.featureFlags as Record<string, boolean>;
    expect(featureFlags.bold).toBe(true);
    expect(featureFlags.link).toBe(true);
    expect(featureFlags.image).toBe(false);
    expect(featureFlags.table).toBe(false);
  });
});
