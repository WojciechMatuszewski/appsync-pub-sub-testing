import { readFileSync } from "fs";
import { join } from "path";
import {
  AppSyncClient,
  EvaluateMappingTemplateCommand
} from "@aws-sdk/client-appsync";
import { expect, test } from "vitest";

const appsyncClient = new AppSyncClient({});

const TodoQueryRequestTemplate = readFileSync(
  join(__dirname, "../Todo.Query.request.vtl")
).toString();

test("TodoQueryRequestTemplate", async () => {
  const result = await appsyncClient.send(
    new EvaluateMappingTemplateCommand({
      template: TodoQueryRequestTemplate,
      context: JSON.stringify({ arguments: { ID: "1" } })
    })
  );
  expect(result.evaluationResult).toMatchInlineSnapshot(`
    "


    {
        \\"version\\": \\"2018-05-29\\",
        \\"payload\\": {\\"name\\":\\"Go GYM\\",\\"ID\\":\\"1\\"}
    }
    "
  `);
});
