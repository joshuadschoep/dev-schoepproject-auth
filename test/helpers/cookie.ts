import Cookie from "cookie";
import { SECRET_DATA } from "..";
import { sign } from "jsonwebtoken";

export const makeCookie = (key: string) => ({
  key: "Cookie",
  value: Cookie.serialize(
    "TOKEN",
    sign({}, key, {
      audience: "https://localhost:5000/",
      subject: "user@example.com",
      expiresIn: SECRET_DATA.SESSION_DURATION,
      algorithm: "RS256",
    })
  ),
});

export const makeCookieHeaders = (key: string) => {
  return [
    {
      key: "Cookie",
      value: Cookie.serialize(
        "TOKEN",
        sign({}, key, {
          audience: "https://localhost:5000/",
          subject: "user@example.com",
          expiresIn: SECRET_DATA.SESSION_DURATION,
          algorithm: "RS256",
        }),
        {
          path: "/",
          maxAge: SECRET_DATA.SESSION_DURATION,
        }
      ),
    },
    {
      key: "Cookie",
      value: Cookie.serialize("NONCE", "", {
        path: "/",
        expires: new Date(1970, 1, 1, 0, 0, 0, 0),
      }),
    },
  ];
};
