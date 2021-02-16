# Deploying HTTP API Lambdas w/ DynamoDB using CDK

This is an example of an HTTP API (AWS API Gateway v2) with endpoints served by Lambda's using DynamoDB as a backend.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

```bash
$ npm run build
$ npm run cdk deploy
```

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
