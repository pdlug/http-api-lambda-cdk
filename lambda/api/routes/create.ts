import { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { v4 as uuid } from "uuid";
import * as yup from "yup";
import type { Asserts } from "yup";

import type { Todo } from "../../models";

import * as db from "../../db";
import { jsonResponse } from "../util";

const client = new DynamoDB({ region: "us-east-1" });

const schema = yup
  .object({
    title: yup.string().required(),
    body: yup.string().optional(),
    done: yup
      .boolean()
      .optional()
      .default(() => false),
  })
  .noUnknown(true);

type CreateTodoInput = Asserts<typeof schema>;

type Response = APIGatewayProxyResultV2<{ error: string } | Todo>;

export const handler: APIGatewayProxyHandlerV2<Response> = async (event): Promise<Response> => {
  if (!event.headers["content-type"]?.match(/^application\/json/) || !event.body) {
    return jsonResponse({ error: "Not JSON" }, 400);
  }

  let CreateTodoInput: CreateTodoInput;
  try {
    CreateTodoInput = schema.validateSync(JSON.parse(event.body), { strict: true });
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return jsonResponse({ error: err.errors.join("; ") });
    } else {
      throw err;
    }
  }

  const newTodo: Todo = {
    id: uuid(),
    ...CreateTodoInput,
  };

  try {
    await db.Todos.create(client, newTodo);
  } catch (err) {
    console.log(err);
    return jsonResponse({ error: err }, 500);
  }

  return jsonResponse(newTodo);
};
