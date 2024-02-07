import { setDiscoveryDocument } from "./discovery";
import { setJwks } from "./jwks";
import { setLambdaClient } from "./lambda";

export default async () => {
  await setDiscoveryDocument();
  await setJwks();
  await setLambdaClient();
};
