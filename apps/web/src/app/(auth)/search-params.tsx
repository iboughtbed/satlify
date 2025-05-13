import { parseAsString, createLoader } from "nuqs/server";

export const authSearchParams = {
  callbackUrl: parseAsString,
};

export const loadSearchParams = createLoader(authSearchParams);
