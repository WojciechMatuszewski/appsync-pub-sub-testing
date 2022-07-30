import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as aws_appsync from "@aws-cdk/aws-appsync-alpha";
import { join } from "path";

export class PubSubAppsyncStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const graphqlAPI = new aws_appsync.GraphqlApi(this, "PubSubGraphQLAPI", {
      name: "PubSubGraphQLAPI",
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: aws_appsync.AuthorizationType.API_KEY
        }
      },
      logConfig: {
        fieldLogLevel: aws_appsync.FieldLogLevel.ALL,
        excludeVerboseContent: true
      }
    });

    const dataSource = new aws_appsync.NoneDataSource(
      this,
      "PubSubDataSource",
      {
        api: graphqlAPI
      }
    );

    const todoObject = new aws_appsync.ObjectType("Todo", {
      definition: {
        ID: aws_appsync.GraphqlType.id({ isRequired: true }),
        name: aws_appsync.GraphqlType.string({ isRequired: true })
      }
    });
    graphqlAPI.addType(todoObject);

    graphqlAPI.addQuery(
      "getTodo",
      new aws_appsync.ResolvableField({
        returnType: todoObject.attribute(),
        args: {
          ID: aws_appsync.GraphqlType.id({ isRequired: true })
        },
        requestMappingTemplate: aws_appsync.MappingTemplate.fromFile(
          join(__dirname, "./Todo.Query.request.vtl")
        ),
        responseMappingTemplate: aws_appsync.MappingTemplate.fromFile(
          join(__dirname, "./response.vtl")
        ),
        dataSource
      })
    );

    graphqlAPI.addMutation(
      "createTodo",
      new aws_appsync.ResolvableField({
        returnType: todoObject.attribute(),
        args: {
          name: aws_appsync.GraphqlType.id({ isRequired: true })
        },
        requestMappingTemplate: aws_appsync.MappingTemplate.fromFile(
          join(__dirname, "./Todo.Mutation.request.vtl")
        ),
        responseMappingTemplate: aws_appsync.MappingTemplate.fromFile(
          join(__dirname, "./response.vtl")
        ),
        dataSource
      })
    );

    graphqlAPI.addSubscription(
      "todoAdded",
      new aws_appsync.Field({
        returnType: todoObject.attribute(),
        args: {
          ID: aws_appsync.GraphqlType.id({ isRequired: true })
        },
        directives: [aws_appsync.Directive.subscribe("createTodo")]
      })
    );
  }
}
