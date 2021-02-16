export * as create from "./create";
export * as deleteById from "./deleteById";
export * as getAll from "./getAll";
export * as getById from "./getById";
export * as update from "./update";

type Route = {
  handler: string;
  path: string;
  method: "ANY" | "DELETE" | "HEAD" | "GET" | "OPTIONS" | "PATCH" | "POST" | "PUT";
};

export const routes: Route[] = [
  {
    handler: "create",
    path: "/todos",
    method: "POST",
  },
  {
    handler: "getAll",
    path: "/todos",
    method: "GET",
  },
  {
    handler: "getById",
    path: "/todos/{id}",
    method: "GET",
  },
  {
    handler: "deleteById",
    path: "/todos/{id}",
    method: "DELETE",
  },
  {
    handler: "update",
    path: "/todos/{id}",
    method: "PUT",
  },
];
