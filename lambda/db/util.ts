import { marshall } from "@aws-sdk/util-dynamodb";

/*
 * Prefix a key with the given prefix using standard delimiter.
 */
export function prefixKey(prefix: string, v: string): string {
  return `${prefix}#${v}`;
}

/*
 * Remove prefix from a key.
 */
export function unprefixKey(v: string): string {
  return v.replace(/^.*?#/, "");
}

type Update = {
  [k: string]: any;
};

export function buildUpdateExpression(input: Update) {
  const fields = Object.entries(input).reduce<{ [k: string]: any }>(
    (pairs, [key, value]) => (value !== undefined ? { [`:${key}`]: value, ...pairs } : pairs),
    {} as { [k: string]: any },
  );

  const expr =
    "SET " +
    Object.keys(fields)
      .map((placeholder) => `${placeholder.replace(/^:/, "")} = ${placeholder}`)
      .join(", ");

  return {
    ExpressionAttributeValues: marshall(fields),
    UpdateExpression: expr,
  };
}
