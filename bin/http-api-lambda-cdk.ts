#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HttpApiLambdaCdkStack } from '../lib/http-api-lambda-cdk-stack';

const app = new cdk.App();
new HttpApiLambdaCdkStack(app, 'HttpApiLambdaCdkStack');
