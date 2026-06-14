export const withTrailingSlash = (url: string): string =>
  `${url.replace(/\/+$/, "")}/`;
