import chai from "chai";
import isWindows from "is-windows";
import { ParsedScriptUrl, parsePosix, parseSys } from "../lib";

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
    url: "/foo.js",
    expected: {url: "/foo.js", isFileUrl: false},
  },
  {
    url: "file:///foo.mjs",
    expected: {url: "file:///foo.mjs", isFileUrl: true, path: "/foo.mjs"},
  },
];

describe("parsePosix", () => {
  for (const {url, expected} of testItems) {
    it(JSON.stringify(url), () => {
      const actual: ParsedScriptUrl = parsePosix(url);
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

(isWindows() ? describe.skip : describe)("parseSys (posix)", parseSysSuite);
