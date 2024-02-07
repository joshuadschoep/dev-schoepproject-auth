jest.mock("@aws-sdk/client-lambda", () => ({
  LambdaClient: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockReturnValue(
      Promise.resolve({
        Authorized: true,
        SignedCookie: "FakeAuthorizationCookie",
      })
    ),
  })),
  InvokeFunction: jest.fn().mockImplementation((Request: any) => ({
    Request,
  })),
}));
