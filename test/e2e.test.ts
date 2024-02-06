import { PRIVATE_KEY, BASE_REQUEST, WRONG_KEY, handle, makeCookieHeaders } from "test";

describe("End-to-end Cases", () => {
    describe("Normal Requests", () => {
        it("should accept a token signed with the private key", async () => {
            const result = await handle({
                ...BASE_REQUEST,
                headers: {
                    cookie: makeCookieHeaders(PRIVATE_KEY),
                },
            });

            // Returning the request from a Lambda@Edge function
            // allows the request to continue to origin
            expect(result).toMatchObject(BASE_REQUEST);
        });

        it("should reject a token signed with a different private key", async () => {
            const result = await handle({
                ...BASE_REQUEST,
                headers: {
                    cookie: makeCookieHeaders(WRONG_KEY),
                },
            });
            expect(result).toMatchObject({
                status: "401",
            });
        });

        it("should redirect a request with no headers to OIDC provider", async () => {
            const result = await handle({
                ...BASE_REQUEST,
                headers: {},
            });
            expect(result).toMatchObject({
                status: "302",
                headers: {
                    location: [
                        {
                            key: "Location",
                            value: expect.stringContaining("https://example.com/authorize"),
                        },
                    ],
                },
            });
        });
    });
});
