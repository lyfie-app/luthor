import { describe, expect, it } from "vitest";
import { isTableEditingUiEnabled } from "./TableExtension";

describe("table read-only interaction helpers", () => {
  it("enables table editing UI only when editor is editable", () => {
    expect(isTableEditingUiEnabled(true)).toBe(true);
    expect(isTableEditingUiEnabled(false)).toBe(false);
  });
});
