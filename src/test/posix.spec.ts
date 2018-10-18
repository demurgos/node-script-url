import chai from "chai";
import { parsePosix, ScriptUrl } from "../lib";

describe("posix", function () {
  it("/foo.js", function () {
    const scriptUrl: string = "/foo.js";
    const expected: ScriptUrl = {
      isRegularFile: true,
      scriptUrl: "/foo.js",
      moduleType: "cjs",
      url: "file:///foo.js",
      path: "/foo.js",
    };
    const actual: ScriptUrl = parsePosix(scriptUrl);
    chai.assert.deepEqual(actual, expected);
  });
});
