import fs from "fs";

export { default as DiscoveryDocument } from "./discovery.json";
export { default as JwksDocument } from "./jwks.json";
export const PRIVATE_KEY = fs.readFileSync("test/mocks/configs/fakeKey.pem").toString();
export const PUBLIC_KEY = fs.readFileSync("test/mocks/configs/fakeKey.pub").toString();
export const WRONG_KEY = fs.readFileSync("test/mocks/configs/wrongKey.pem").toString();
