import { type Secret, type VerifyOptions, verify } from "jsonwebtoken";

// verifyJwt wraps the callback-based JsonWebToken.verify function in a promise.
export const verifyJwt = async (
  token: string,
  pem: Secret,
  options: VerifyOptions
) => {
  return await new Promise<any>((resolve, reject) => {
    verify(token, pem, options, (err, decoded) => {
      if (err != null) {
        reject(err);
      }
      resolve(decoded);
    });
  });
};
