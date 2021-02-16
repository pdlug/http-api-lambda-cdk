import * as cdk from "@aws-cdk/core";
import * as apigw2 from "@aws-cdk/aws-apigatewayv2";
import * as apigwIntegrations from "@aws-cdk/aws-apigatewayv2-integrations";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as lambdaNodeJS from "@aws-cdk/aws-lambda-nodejs";

import { routes } from "../lambda/api/routes";

export type ApiProps = {
  apiName: string;
  table: ddb.Table;
};

export class Api extends cdk.Construct {
  public readonly api: apigw2.HttpApi;

  constructor(scope: cdk.Construct, id: string, { apiName, table }: ApiProps) {
    super(scope, id);

    const httpApi = new apigw2.HttpApi(this, "API", {
      apiName,
    });

    routes.forEach(({ handler, path, method }) => {
      const apiLambda = new lambdaNodeJS.NodejsFunction(this, `api-route-${handler}`, {
        entry: `${__dirname}/../lambda/api/routes/index.ts`,
        handler: `${handler}.handler`,
        runtime: lambda.Runtime.NODEJS_14_X,
        timeout: cdk.Duration.seconds(5),
        environment: {
          TABLE_NAME: table.tableName,
        },
      });
      table.grantFullAccess(apiLambda);

      const routeIntegration = new apigwIntegrations.LambdaProxyIntegration({
        handler: apiLambda,
      });

      httpApi.addRoutes({
        path,
        methods: [apigw2.HttpMethod[method]],
        integration: routeIntegration,
      });
    });

    this.api = httpApi;
  }
}
