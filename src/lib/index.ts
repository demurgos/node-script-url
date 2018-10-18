import { fromPosixPath, fromSysPath, fromWindowsPath, toPosixPath, toSysPath, toWindowsPath } from "furi";
import isWindows from "is-windows";
import sysPath from "path";
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
  return isWindows ? parseWindows(scriptUrl) : parsePosix(scriptUrl);
}

export function parsePosix(scriptUrl: string): ScriptUrl {
  return parse(scriptUrl, toPosixPath, fromPosixPath, sysPath.posix.isAbsolute);
}

export function parseWindows(scriptUrl: string): ScriptUrl {
  return parse(scriptUrl, toWindowsPath, fromWindowsPath, sysPath.win32.isAbsolute);
}

function parse(
  scriptUrl: string,
  toPath: typeof toSysPath,
  fromPath: typeof fromSysPath,
  isAbsolutePath: typeof sysPath.isAbsolute,
): ScriptUrl {
  if (isAbsolutePath(scriptUrl)) {
    return {
      isRegularFile: true,
      scriptUrl,
      moduleType: "cjs",
      url: fromPath(scriptUrl).href,
      path: scriptUrl,
    };
  }

  try {
    const urlObj: url.URL = new url.URL(scriptUrl);
    if (urlObj.protocol !== "file:") {
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
    if (err.code === "ERR_INVALID_URL") {
      return {isRegularFile: false, scriptUrl};
    } else {
      throw err;
    }
  }
}
