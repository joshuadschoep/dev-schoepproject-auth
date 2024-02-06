import type { CloudFrontRequest, CloudFrontRequestEventRecord, CloudFrontResponse, Context } from "aws-lambda";
import { v4 as uuid4 } from "uuid";
import { handler } from "src";

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export const handle = async (request: CloudFrontRequest): Promise<CloudFrontRequest | CloudFrontResponse> => {
    return await new Promise<CloudFrontRequest | CloudFrontResponse>((resolve, _reject) => {
        void handler(
            {
                Records: [
                    {
                        // eslint-disable-next-line
                        cf: {
                            request,
                        } as CloudFrontRequestEventRecord["cf"],
                    },
                ],
            },
            // eslint-disable-next-line
            {
                awsRequestId: uuid4(),
            } as Context,
            (_, result) => {
                resolve(result);
            }
        );
    });
};
