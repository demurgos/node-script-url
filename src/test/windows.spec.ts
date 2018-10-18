import chai from "chai";
import { parseWindows, ScriptUrl } from "../lib";

interface TestItem {
  url: string;
  expected: ScriptUrl;
}

const testItems: ReadonlyArray<TestItem> = [
  {
    url: "",
    expected: {isRegularFile: false, scriptUrl: ""},
  },
  {
    url: "url.js",
    expected: {isRegularFile: false, scriptUrl: "url.js"},
  },
  {
    url: "internal/url.js",
    expected: {isRegularFile: false, scriptUrl: "internal/url.js"},
  },
  {
    url: "internal/util/inspect.js",
    expected: {isRegularFile: false, scriptUrl: "internal/util/inspect.js"},
  },
  {
    url: "C:\\foo.js",
    expected: {
      isRegularFile: true,
      scriptUrl: "C:\\foo.js",
      moduleType: "cjs",
      url: "file:///C:/foo.js",
      path: "C:\\foo.js",
    },
  },
  {
    url: "file:///C:/foo.mjs",
    expected: {
      isRegularFile: true,
      scriptUrl: "file:///C:/foo.mjs",
      moduleType: "esm",
      url: "file:///C:/foo.mjs",
      path: "C:\\foo.mjs",
    },
  },
];

describe("parseWindows", () => {
  for (const {url, expected} of testItems) {
    it(JSON.stringify(url), () => {
      const actual: ScriptUrl = parseWindows(url);
      chai.assert.deepEqual(actual, expected);
    });
  }
});
