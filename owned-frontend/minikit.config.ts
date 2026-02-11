const ROOT_URL = "https://ownedit.xyz";

export const minikitConfig = {
    accountAssociation: {
        "header": "",
        "payload": "",
        "signature": ""
    },
    miniapp: {
        version: "1",
        name: "Owned IT",
        subtitle: "Stack sats, not subscriptions",
        description: "Crypto-native creator commerce. Get paid onchain without platform risk.",
        screenshotUrls: [`${ROOT_URL}/assets/dashboard_preview.png`],
        iconUrl: `${ROOT_URL}/assets/logo.png`,
        splashImageUrl: `${ROOT_URL}/assets/logo.png`,
        splashBackgroundColor: "#ffffff",
        homeUrl: ROOT_URL,
        webhookUrl: `${ROOT_URL}/api/webhook`,
        primaryCategory: "social",
        tags: ["commerce", "crypto", "creators"],
        heroImageUrl: `${ROOT_URL}/assets/logo.png`,
        tagline: "Own your audience.",
        ogTitle: "OWNED IT",
        ogDescription: "Sell your knowledge direct to your audience.",
        ogImageUrl: `${ROOT_URL}/assets/logo.png`,
    },
} as const;
