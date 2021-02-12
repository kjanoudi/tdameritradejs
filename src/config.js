"use strict";

const config = {
    baseURL: "https://api.tdameritrade.com/v1",
    refreshAndRetry: true,
    returnFullResponse: false,
    rateLimit: { maxRequests: 1, perMilliseconds: 1000 },
}

module.exports = config
