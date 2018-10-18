import chai from "chai";
import { parsePosix, ScriptUrl } from "../lib";

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
    url: "/foo.js",
    expected: {
      isRegularFile: true,
      scriptUrl: "/foo.js",
      moduleType: "cjs",
      url: "file:///foo.js",
      path: "/foo.js",
    },
  },
  {
    url: "file:///foo.mjs",
    expected: {
      isRegularFile: true,
      scriptUrl: "file:///foo.mjs",
      moduleType: "esm",
      url: "file:///foo.mjs",
      path: "/foo.mjs",
    },
  },
];

describe("parsePosix", () => {
  for (const {url, expected} of testItems) {
    it(JSON.stringify(url), () => {
      const actual: ScriptUrl = parsePosix(url);
      chai.assert.deepEqual(actual, expected);
    });
  }
});
