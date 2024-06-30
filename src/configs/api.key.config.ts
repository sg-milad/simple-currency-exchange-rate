import { registerAs } from "@nestjs/config";

export default registerAs("apiKey", () => ({
    navasan: process.env.NAVASAN_API_KEY
}));
