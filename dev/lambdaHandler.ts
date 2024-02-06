import { RequestHandler } from "express";
import log from "../src/log";

export const lambdaHandler: RequestHandler = (req) => {
    log("info", "NEW REQUEST", req.url);
};

// const createCloudfrontViewerRequest = (request: Request): CloudFrontRequestEvent => ({
//     Records: [
//         {
//             cf: {
//                 request: {
//                     method: request.method,
//                     clientIp: request.ip,
//                     uri: request.url,
//                     headers: {
//                         cookie: [
//                             // {
//                             // }
//                             // request.headers.cookie
//                         ],
//                     },
//                 },
//             },
//         },
//     ],
// });
