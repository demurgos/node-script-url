import { fromPosixPath, fromSysPath, fromWindowsPath, toPosixPath, toSysPath, toWindowsPath } from "furi";
import url from "url";

export type ModuleType = "cjs" | "esm";

export type ScriptUrl = FileScriptUrl | InternalScriptUrl;

/**
 * Regular file.
 */
export interface FileScriptUrl {
  isRegularFile: true;
  scriptUrl: string;
  moduleType: ModuleType;
  url: string;
  path: string;
}

/**
 * Internal or non-file URL.
 */
export interface InternalScriptUrl {
  isRegularFile: false;
  scriptUrl: string;
}

export function parseSys(scriptUrl: string): ScriptUrl {
  return parse(scriptUrl, toSysPath, fromSysPath);
}

export function parsePosix(scriptUrl: string): ScriptUrl {
  return parse(scriptUrl, toPosixPath, fromPosixPath);
}

export function parseWindows(scriptUrl: string): ScriptUrl {
  return parse(scriptUrl, toWindowsPath, fromWindowsPath);
}

const INTERNAL_CJS_REGEX: RegExp = /^(?:\w+|internal\/[\s\S])+\.js$/;

function parse(scriptUrl: string, toPath: typeof toSysPath, fromPath: typeof fromSysPath): ScriptUrl {
  if (INTERNAL_CJS_REGEX.test(scriptUrl)) {
    return {isRegularFile: false, scriptUrl};
  }

  try {
    const urlObj: url.URL = new url.URL(scriptUrl);
    if (urlObj.protocol !== "file") {
      return {isRegularFile: false, scriptUrl};
    }
    return {
      isRegularFile: true,
      scriptUrl,
      moduleType: "esm",
      url: urlObj.href,
      path: toPath(urlObj.href),
    };
  } catch (err) {
    return {
      isRegularFile: true,
      scriptUrl,
      moduleType: "cjs",
      url: fromPath(scriptUrl).href,
      path: scriptUrl,
    };
  }
}
