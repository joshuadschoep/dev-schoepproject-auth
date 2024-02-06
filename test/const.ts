export const BASE_REQUEST = {
    method: "GET",
    uri: "/",
    querystring: "",
    clientIp: "127.0.0.1",
};

export const CALLBACK_REQUEST = {
    ...BASE_REQUEST,
    uri: "/_callback",
};
