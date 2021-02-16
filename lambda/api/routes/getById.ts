import { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

import type { Todo } from "../../models";

import * as db from "../../db";
import { jsonResponse } from "../util";

const client = new DynamoDB({ region: "us-east-1" });

type Response = APIGatewayProxyResultV2<{ error: string } | { message: string } | Todo>;

export const handler: APIGatewayProxyHandlerV2<Response> = async (event): Promise<Response> => {
  const id = event.pathParameters?.id;

  if (!id) {
    return jsonResponse({ message: "Not Found" }, 404);
  }

  const todo = await db.Todos.getById(client, id);
  return todo ? jsonResponse(todo) : jsonResponse({ message: "Not Found" }, 404);
};
