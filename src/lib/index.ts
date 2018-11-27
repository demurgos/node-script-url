import { toPosixPath, toSysPath, toWindowsPath } from "furi";
import isWindows from "is-windows";

export type ParsedScriptUrl = FileScriptUrl | InternalScriptUrl;

/**
 * Regular file.
 */
export interface FileScriptUrl {
  /**
   * Input URL
   */
  url: string;

  /**
   * Boolean indicating if this is a non-internal `file://` URL (always `true`).
   */
  isFileUrl: true;

  /**
   * Corresponding file path.
   */
  path: string;
}

/**
 * Internal or non-file URL.
 */
export interface InternalScriptUrl {
  /**
   * Input URL
   */
  url: string;

  /**
   * Boolean indicating if this is a non-internal `file://` URL (always `false`).
   */
  isFileUrl: false;
}

export function parseSys(url: string): ParsedScriptUrl {
  return isWindows() ? parseWindows(url) : parsePosix(url);
}

export function parsePosix(url: string): ParsedScriptUrl {
  return parse(url, toPosixPath);
}

export function parseWindows(url: string): ParsedScriptUrl {
  return parse(url, toWindowsPath);
}

function parse(
  url: string,
  toPath: typeof toSysPath,
): ParsedScriptUrl {
  if (url.startsWith("file://")) {
    return {url, isFileUrl: true, path: toPath(url)};
  } else {
    return {url, isFileUrl: false};
  }
}
