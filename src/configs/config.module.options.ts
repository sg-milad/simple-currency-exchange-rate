import { productionEnv } from "src/shared/helper/helper";
import databaseConfig from "./database.config";
import { ConfigModuleOptions } from "@nestjs/config";
import apiKeyConfig from "./api.key.config";

export function ConfigModuleOptions(): ConfigModuleOptions {
    const options: ConfigModuleOptions = {};
    options.isGlobal = true;
    options.cache = true;
    options.load = [databaseConfig, apiKeyConfig];
    if (!productionEnv()) {
        options.envFilePath = `.env.${process.env.NODE_ENV}`;
    }
    return options;
}
