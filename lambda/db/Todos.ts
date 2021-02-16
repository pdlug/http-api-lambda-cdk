import {
  DynamoDB,
  DeleteItemInput,
  GetItemInput,
  PutItemInput,
  ScanInput,
  UpdateItemInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import type { BaseItem } from "./index";
import type { Todo } from "../models";
import { prefixKey, unprefixKey, buildUpdateExpression } from "./util";

export type TodoItem = BaseItem & {
  title: string;
  body: string;
  done: boolean;
};

/*
 * Convert a todo item from DDB to a Todo object.
 */
function itemToTodo(item: TodoItem): Todo {
  return {
    id: unprefixKey(item.pk),
    title: item.title,
    body: item.body,
    done: item.done,
  };
}

/*
 * Create a new todo.
 */
export async function create(client: DynamoDB, todo: Todo): Promise<string> {
  const { id, ...rest } = todo;
  const key = prefixKey("TODO", id);

  const todoParams: PutItemInput = {
    TableName: process.env.TABLE_NAME,
    Item: marshall({
      pk: key,
      sk: key,
      gs1pk: "type",
      gs1sk: key,
      ...rest,
    }),
  };

  await client.putItem(todoParams);

  return todo.id;
}

/*
 * Get all todos.
 */
export async function all(client: DynamoDB): Promise<Todo[]> {
  const scanTodos: ScanInput = {
    TableName: process.env.TABLE_NAME,
  };

  const { Items } = await client.scan(scanTodos);
  return Items ? Items.map((item) => itemToTodo(unmarshall(item) as TodoItem)) : [];
}

/*
 * Get an todo by ID.
 */
export async function getById(client: DynamoDB, id: string): Promise<Todo | null> {
  const key = prefixKey("TODO", id);

  const getTodo: GetItemInput = {
    TableName: process.env.TABLE_NAME,
    Key: marshall({
      pk: key,
      sk: key,
    }),
  };

  const { Item } = await client.getItem(getTodo);
  return Item ? itemToTodo(unmarshall(Item) as TodoItem) : null;
}

/*
 * Delete a todo by ID.
 */
export async function deleteById(client: DynamoDB, id: string): Promise<boolean> {
  const key = prefixKey("TODO", id);

  const deleteTodo: DeleteItemInput = {
    TableName: process.env.TABLE_NAME,
    Key: marshall({
      pk: key,
      sk: key,
    }),
  };

  await client.deleteItem(deleteTodo);

  return true;
}

type UpdateTodoInput = Partial<Omit<Todo, "id">>;

/*
 * Update a todo.
 */
export async function update(client: DynamoDB, id: string, input: UpdateTodoInput): Promise<Todo | null> {
  const key = prefixKey("TODO", id);

  const { UpdateExpression, ExpressionAttributeValues } = buildUpdateExpression(input);

  const updateTodo: UpdateItemInput = {
    TableName: process.env.TABLE_NAME,
    Key: marshall({
      pk: key,
      sk: key,
    }),
    UpdateExpression,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  const { Attributes } = await client.updateItem(updateTodo);

  return Attributes ? itemToTodo(unmarshall(Attributes) as TodoItem) : null;
}
