import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { aws_dynamodb as ddb } from "aws-cdk-lib";

export class Database extends Construct {
  public readonly table: ddb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const table = new ddb.Table(this, "TodosTable", {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "pk",
        type: ddb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: ddb.AttributeType.STRING,
      },
    });

    table.addGlobalSecondaryIndex({
      indexName: "gs1",
      partitionKey: {
        name: "gs1pk",
        type: ddb.AttributeType.STRING,
      },
      sortKey: {
        name: "gs1sk",
        type: ddb.AttributeType.STRING,
      },
    });

    this.table = table;
  }
}
