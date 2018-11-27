import chai from "chai";
import isWindows from "is-windows";
import { ParsedScriptUrl, parseSys, parseWindows } from "../lib";

interface TestItem {
  url: string;
  expected: ParsedScriptUrl;
}

const testItems: ReadonlyArray<TestItem> = [
  {
    url: "",
    expected: {url: "", isFileUrl: false},
  },
  {
    url: "url.js",
    expected: {url: "url.js", isFileUrl: false},
  },
  {
    url: "internal/url.js",
    expected: {url: "internal/url.js", isFileUrl: false},
  },
  {
    url: "internal/util/inspect.js",
    expected: {url: "internal/util/inspect.js", isFileUrl: false},
  },
  {
    url: "C:\\foo.js",
    expected: {url: "C:\\foo.js", isFileUrl: false},
  },
  {
    url: "file:///C:/foo.mjs",
    expected: {url: "file:///C:/foo.mjs", isFileUrl: true, path: "C:\\foo.mjs"},
  },
];

describe("parseWindows", () => {
  for (const {url, expected} of testItems) {
    it(JSON.stringify(url), () => {
      const actual: ParsedScriptUrl = parseWindows(url);
      chai.assert.deepEqual(actual, expected);
    });
  }
});

function parseSysSuite() {
  for (const {url, expected} of testItems) {
    it(JSON.stringify(url), () => {
      const actual: ParsedScriptUrl = parseSys(url);
      chai.assert.deepEqual(actual, expected);
    });
  }
}

(isWindows() ? describe : describe.skip)("parseSys (windows)", parseSysSuite);
