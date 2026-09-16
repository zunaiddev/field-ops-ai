import { Transform, TransformFnParams } from "class-transformer";

export interface TransformStringOptions {
  trim?: boolean;
  lowercase?: boolean;
  camelCase?: boolean;
}

const toCamelCase = (str: string): string => {
  return str
    .trim()
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
};

export function TransformString(
  options: TransformStringOptions = { trim: true },
) {
  return Transform(({ value }: TransformFnParams) => {
    if (typeof value !== "string") return value;

    let result = value;

    if (options.trim) {
      result = result.trim();
    }

    if (options.lowercase) {
      result = result.toLowerCase();
    }

    if (options.camelCase) {
      result = toCamelCase(result);
    }

    return result;
  });
}

export const Trim = () => TransformString({ trim: true });

export const ToLowerCase = () => TransformString({ lowercase: true });

export const ToCamelCase = () => TransformString({ camelCase: true });

export const CleanEmail = () =>
  TransformString({ trim: true, lowercase: true });