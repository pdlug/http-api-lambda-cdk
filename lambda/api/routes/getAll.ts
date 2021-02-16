import { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

import type { Todo } from "../../models";

import * as db from "../../db";
import { jsonResponse } from "../util";

const client = new DynamoDB({ region: "us-east-1" });

type Response = APIGatewayProxyResultV2<{ error: string } | Todo[]>;

export const handler: APIGatewayProxyHandlerV2<Response> = async (_event): Promise<Response> => {
  try {
    const todos = await db.Todos.all(client);

    return jsonResponse(todos);
  } catch (err) {
    console.log(err);
    return jsonResponse({ error: err }, 500);
  }
};
