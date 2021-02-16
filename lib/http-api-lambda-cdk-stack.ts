import * as cdk from "@aws-cdk/core";

import { Api } from "./api";
import { Database } from "./database";

export class HttpApiLambdaCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new Database(this, "DB");

    const api = new Api(this, "API", {
      apiName: "test-api",
      table: database.table,
    });

    new cdk.CfnOutput(this, "APIURL", {
      value: api.api.url || "",
    });
  }
}
