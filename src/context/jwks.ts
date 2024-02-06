import axios from "axios";
import { discoveryDocument } from "./discovery";

export var jwks: any;

// setJwks sets the jwks object if it wasn't already set.
export const setJwks = async () => {
    if (jwks === undefined) {
        if (
            discoveryDocument !== undefined &&
            (discoveryDocument.jwks_uri === undefined || discoveryDocument.jwks_uri === null)
        ) {
            throw new Error("Unable to find JWK in discovery document");
        }
        jwks = (await axios.get(discoveryDocument.jwks_uri)).data;
    }
};
