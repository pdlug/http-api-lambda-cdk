# Deploying HTTP API Lambdas w/ DynamoDB using CDK

This is an example of an HTTP API (AWS API Gateway v2) with endpoints served by Lambda's using DynamoDB as a backend.

## Usage

Build and deploy using the scripts:

```bash
$ npm run build
$ npm run cdk deploy
```

This will deploy the stack into your AWS account and create all resources. When the execution finishes the API URL will be in the output:

```bash
HttpApiLambdaCdkStack.APIURL = https://_____.execute-api.us-east-1.amazonaws.com/
```

You can pass additional options to `cdk deploy` as needed. Common use case of this is passing an alternate profile, ex: `npm run cdk deploy -- --profile myprofile`.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## REST API

Very basic CRUD REST API.

### POST /todos

Create a new To Do

Example using `curl`:

```bash
$ curl -H 'Content-type: application/json' -d '
  {
    "title": "Something to do",
    "body": "More detail"
  }' \
  {API_URL}/todos
```

Example response:

```json
{
  "id": "984ea401-af69-4c85-9d92-5f195d942396",
  "done": false,
  "body": "More detail",
  "title": "Something to do"
}
```

### GET /todos

Retrieve all to dos.

Example using `curl`:

```bash
$ curl {API_URL}/todos
```

### GET /todos/{id}

Retrieve a to do by its ID.

Example using `curl`:

```bash
$ curl {API_URL}/todos/984ea401-af69-4c85-9d92-5f195d942396
```

### PUT /todos/{id}

Update a todo.

Example using `curl`:

```bash
$ curl -D - -X PUT -H 'content-type: application/json' -d '
  {
    "title": "Updated To Do"
  }' \
  {API_URL}/todos/984ea401-af69-4c85-9d92-5f195d942396
```

### DELETE /todos/{id}

Delete a to do.

Example using `curl`:

```bash
$ curl -X DELETE {API_URL}/todos/984ea401-af69-4c85-9d92-5f195d942396
```
