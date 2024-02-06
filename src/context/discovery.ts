import axios from "axios";
import { config } from "./config";

export var discoveryDocument: any;

// setDiscoveryDocument sets the discoveryDocument object if it wasn't already set.
export const setDiscoveryDocument = async () => {
    if (discoveryDocument === undefined) {
        discoveryDocument = (await axios.get(config.DISCOVERY_DOCUMENT)).data;
    }
};
