import { BigNumber } from "ethers";

export function customError(error: string, args?: ErrorArg[]) {
  let errorArgs = !!args ? concatErrorArgs(args) : "";
  return `VM Exception while processing transaction: reverted with custom error '${error}(${errorArgs})'`;
}

function concatErrorArgs(arr: Array<any>) {
  let result: string = "";
  for (let i = 0; i < arr.length; i++) {
    result += parseError(arr[i]);
    if (i < arr.length - 1) {
      result += ", ";
    }
  }
  return result;
}

function parseError(error?: ErrorArg) {
  if (typeof error === "string") {
    return `"${error.toString()}"`;
  } else if (typeof error === "number" || error instanceof BigNumber) {
    return error.toString();
  } else if (Array.isArray(error)) {
    return `[${concatErrorArgs(error)}]`;
  } else {
    return "";
  }
}

type ErrorArgFraction = Number | BigNumber | String;
type ErrorArg = ErrorArgFraction | Array<ErrorArgFraction>;
