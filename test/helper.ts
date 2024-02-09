import type { Callback, Context } from "aws-lambda";
import { handler } from "src/index";

export interface HandleConfig {
  route?: string;
  cookies?: any[];
  method?: string;
  querystring?: string;
}

export const handle = async (config: HandleConfig, callback: Callback<any>) => {
  return await handler(
    {
      Records: [
        {
          cf: {
            request: {
              clientIp: "127.0.0.1",
              method: config.method ?? "GET",
              querystring: config.querystring ?? "",
              uri: config.route ?? "/",
              headers: {
                cookie: config.cookies ?? [],
              },
            },
            config: {
              distributionId: "testDistribution",
              distributionDomainName: "test.example.com",
              eventType: "viewer-request",
              requestId: "testRequest",
            },
          },
        },
      ],
    },
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    {
      awsRequestId: "testRequest",
      functionName: "testFunction",
      functionVersion: "$LATEST",
    } as Context,
    callback
  );
};
