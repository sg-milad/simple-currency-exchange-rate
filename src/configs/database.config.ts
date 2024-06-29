import { registerAs } from "@nestjs/config";
import * as process from "process";

export default registerAs("database", () => ({
    main: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || "5432"),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
}));
