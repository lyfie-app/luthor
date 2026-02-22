import { CodeIntelligenceExtension } from "./CodeIntelligenceExtension";

describe("CodeIntelligenceExtension language options", () => {
  it("returns default language options when no override is provided", () => {
    const extension = new CodeIntelligenceExtension();
    const options = extension.getLanguageOptionsSnapshot();

    expect(options).toContain("plaintext");
    expect(options).toContain("typescript");
  });

  it("appends custom language options and normalizes aliases", () => {
    const extension = new CodeIntelligenceExtension().configure({
      languageOptions: {
        mode: "append",
        values: ["javascript", "js", "tsx", "SQL"],
      },
    }) as CodeIntelligenceExtension;

    const options = extension.getLanguageOptionsSnapshot();

    expect(options).toContain("javascript");
    expect(options).toContain("tsx");
    expect(options).toContain("sql");
    expect(options.filter((option) => option === "javascript")).toHaveLength(1);
  });

  it("replaces defaults when mode is replace", () => {
    const extension = new CodeIntelligenceExtension().configure({
      languageOptions: {
        mode: "replace",
        values: ["typescript", "js", "sql"],
      },
    }) as CodeIntelligenceExtension;

    const options = extension.getLanguageOptionsSnapshot();

    expect(options).toEqual(["javascript", "sql", "typescript"]);
    expect(options).not.toContain("plaintext");
  });

  it("throws for duplicate normalized options", () => {
    const extension = new CodeIntelligenceExtension().configure({
      languageOptions: {
        mode: "replace",
        values: ["js", "javascript"],
      },
    }) as CodeIntelligenceExtension;

    expect(() => extension.getLanguageOptionsSnapshot()).toThrow(/Duplicate language option/);
  });

  it("throws for invalid options", () => {
    const extension = new CodeIntelligenceExtension().configure({
      languageOptions: {
        mode: "replace",
        values: ["auto"],
      },
    }) as CodeIntelligenceExtension;

    expect(() => extension.getLanguageOptionsSnapshot()).toThrow(/Invalid language option/);
  });
});
