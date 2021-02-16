import { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";

// import { jsonResponse } from "./util";

type SignedUrlResponse = APIGatewayProxyResultV2<{ hello: string }>;

export const handler: APIGatewayProxyHandlerV2<SignedUrlResponse> = async (_event): Promise<SignedUrlResponse> => {
  // return jsonResponse({ hello: "World!" });
  return {
    statusCode: 200,
    body: JSON.stringify({ hello: "World!" }),
  };
};
