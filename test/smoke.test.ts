import "dotenv/config";
import "./mock";
import DiscoveryDocument from "./discovery.json";
import { handle } from "./helper";

describe("Developer Authentication Method", () => {
  describe("Unauthorized Redirect", () => {
    it("should redirect to discovery document's auth endpoint when receiving unauthenticated request", async () => {
      const callback = jest.fn();
      await handle({}, callback);
      expect(callback).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          status: "302",
          headers: expect.objectContaining({
            location: expect.arrayContaining([
              {
                key: "Location",
                value: expect.stringContaining(
                  DiscoveryDocument.authorization_endpoint
                ),
              },
            ]),
          }),
        })
      );
    });

    it("should set a nonce cookie for xsrf protection", async () => {
      const callback = jest.fn();
      await handle({}, callback);
      expect(callback).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          status: "302",
          headers: expect.objectContaining({
            "set-cookie": expect.arrayContaining([
              {
                key: "Set-Cookie",
                value: expect.stringContaining(
                  process.env.NONCE_COOKIE_NAME ?? "NONCE"
                ),
              },
            ]),
          }),
        })
      );
    });

    it("should reset any previous tokens in cookies to blank values", async () => {
      const callback = jest.fn();
      await handle({}, callback);
      expect(callback).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          status: "302",
          headers: expect.objectContaining({
            "set-cookie": expect.arrayContaining([
              {
                key: "Set-Cookie",
                value: expect.stringContaining(
                  process.env.COOKIE_NAME ?? "TOKEN"
                ),
              },
            ]),
          }),
        })
      );
    });
  });

  describe("OIDC Callbacks", () => {
    it("should return an error if a user manually hits _callback", async () => {
      const callback = jest.fn();
      await handle(
        {
          route: process.env.OIDC_CALLBACK_PATH,
        },
        callback
      );
      expect(callback).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          status: "401",
        })
      );
    });

    it("should return an error if the OIDC callback is called with an error", async () => {
      const callback = jest.fn();
      await handle(
        {
          route: process.env.OIDC_CALLBACK_PATH,
          querystring: "error=InvalidOIDCRequest",
        },
        callback
      );
      expect(callback).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          status: "401",
        })
      );
    });

    describe("OIDC Access Code Exchange", () => {
      it("should call the authorization URL with the querystring code", async () => {});
    });
  });
});
