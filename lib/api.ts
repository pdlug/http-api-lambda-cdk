import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as apigw2 from "@aws-cdk/aws-apigatewayv2-alpha";
import * as apigwIntegrations from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { aws_dynamodb as ddb } from "aws-cdk-lib";
import { aws_lambda as lambda } from "aws-cdk-lib";
import { aws_lambda_nodejs as lambdaNodeJS } from "aws-cdk-lib";

import { routes } from "../lambda/api/routes";

export type ApiProps = {
  apiName: string;
  table: ddb.Table;
};

export class Api extends Construct {
  public readonly api: apigw2.HttpApi;

  constructor(scope: Construct, id: string, { apiName, table }: ApiProps) {
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

      const routeIntegration = new apigwIntegrations.HttpLambdaIntegration(
        `api-route-${handler}-integration`,
        apiLambda,
      );

      httpApi.addRoutes({
        path,
        methods: [apigw2.HttpMethod[method]],
        integration: routeIntegration,
      });
    });

    this.api = httpApi;
  }
}
