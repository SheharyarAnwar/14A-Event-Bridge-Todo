#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TodoAppBridgeBackendStack } from '../lib/todo-app-bridge-backend-stack';

const app = new cdk.App();
new TodoAppBridgeBackendStack(app, 'TodoAppBridgeBackendStack');
