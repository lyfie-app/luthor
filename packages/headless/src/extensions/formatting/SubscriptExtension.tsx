import { TextFormatExtension } from "@lyfie/luthor-headless/extensions/base";

export class SubscriptExtension extends TextFormatExtension<"subscript"> {
  constructor() {
    super("subscript");
  }
}

export const subscriptExtension = new SubscriptExtension();
