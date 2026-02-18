import { TextFormatExtension } from "@lyfie/luthor-headless/extensions/base";

export class SuperscriptExtension extends TextFormatExtension<"superscript"> {
  constructor() {
    super("superscript");
  }
}

export const superscriptExtension = new SuperscriptExtension();
