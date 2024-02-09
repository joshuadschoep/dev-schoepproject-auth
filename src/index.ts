import "dotenv/config";
import type { CloudFrontRequestEvent, Handler } from "aws-lambda";
import {
  INTERNAL_SERVER_ERROR_RESPONSE,
  UNAUTHORIZED_ERROR,
} from "./responses";
import { route } from "./request/route";
import { setContext } from "./context";
import { UnauthorizedError } from "./exceptions";
import log from "./log";

export const handler: Handler<CloudFrontRequestEvent> = async (
  event,
  ctx,
  cb
) => {
  log("info", "NEW EVENT", event, ctx);
  const { request } = event.Records[0].cf;
  try {
    await setContext();
    const result = await route(request);
    cb(null, result);
  } catch (err: any) {
    if (err instanceof UnauthorizedError) {
      log("warning", `UNAUTHORIZED ERROR: ${err.message}`);
      cb(null, UNAUTHORIZED_ERROR);
    } else {
      log("error", `INTERNAL SERVER ERROR, ${err.name}`, err, ctx);
      cb(null, INTERNAL_SERVER_ERROR_RESPONSE);
    }
  }
};
