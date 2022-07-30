#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PubSubAppsyncStack } from "../lib/pub-sub-appsync-stack";

const app = new cdk.App();
new PubSubAppsyncStack(app, "PubSubStack", {
  synthesizer: new cdk.DefaultStackSynthesizer({ qualifier: "pubsub" })
});
