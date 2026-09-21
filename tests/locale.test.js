import test from "node:test";
import assert from "node:assert/strict";
import { resolveDeviceLanguage } from "../js/locale.js";

test("Chinese browser locales open the Chinese interface", () => {
  assert.equal(resolveDeviceLanguage(["zh-CN"]), "zh");
  assert.equal(resolveDeviceLanguage(["zh-TW"]), "zh");
  assert.equal(resolveDeviceLanguage(["yue-HK"]), "zh");
});

test("non-Chinese browser locales open the English interface", () => {
  assert.equal(resolveDeviceLanguage(["en-US"]), "en");
  assert.equal(resolveDeviceLanguage(["ja-JP", "zh-CN"]), "en");
  assert.equal(resolveDeviceLanguage([]), "en");
});
