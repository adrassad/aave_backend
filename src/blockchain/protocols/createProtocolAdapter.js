import { protocolRegistry } from "./index.js";

export function createProtocolAdapter({
    protocolName,
    provider,
    protocolConfig
}){
    const Adapter = protocolRegistry[protocolName];

    if (!Adapter) {
        throw new Error(`Protocol ${protocolName} not supported`);
    }
    return new Adapter({
        provider,
        config: protocolConfig
    })
}