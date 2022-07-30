# AppSync pub-sub

Inspired by [this documentation page](https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-create-generic-api-serverless-websocket.html).

## Learnings

- I had trouble with formatting when I tried to use the `MappingTemplate.fromString` (inline) function.
  For your sanity sake, I would recommend sticking with separate files for resolvers.

- **Debugging VTL templates used to be very hard – it's getting easier and easier**.

  - First, **if you have logs enabled**, you can take advantage of the **`$util.log`** methods.

    - **Remember** that you **cannot log fields as is**. Only fields **defined by the documentation contain values**.

      ```vtl
        $util.log.info("The context is: {}", $context.arguments) ## Will log "The context is: com.amazonaws.deepdish.transform.model.MappingTemplateContext@40ac0c18"

        $util.log.info("Context arguments: {}", $context.arguments) ## Will log "The context is: {ID=1}"
      ```

  - If you do not want to turn on CloudWatch (AppSync produces a LOT of logs, even with the verbose logging turned off), you should **consider using the `$util.validate(false, ...)`**.

  - If you want to **write unit tests without using the AppSync SDK**, you will need to simulate how AppSync parses VTL.
    One can achieve this by utilizing the same packages that AppSync uses. You can find [the code here](https://github.com/theburningmonk/appsyncmasterclass-backend/blob/main/__tests__/steps/when.js#L346).

    - **Alternatively, you can use AWS SDK** and evaluate the VTL template via the SDK call. I prefer this method over running the simulator. Nothing to update, all you do is an SDK call. Refer to the code in `lib/__tests__/template.test.ts`.

      - It would be nice to have a type defined for the `context`. Requiring a `string` instead of a well-typed object seems lazy to me.

- AppSync documentation is good. The issues I had usually stemmed from me not reading it.

- **`vitest` feels much better than `jest`**. It might be the "new cool tool" bias, but it "just" feels better. (I have not yet had the chance to mock time with asynchronous functions with `vitest`. Maybe after trying, I will hate it as much I hate `jest`?).
