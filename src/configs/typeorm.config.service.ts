import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    private dbConfig;

    constructor(protected readonly configService: ConfigService) {
        this.dbConfig = configService.get("database.main");
    }

    public createTypeOrmOptions(): TypeOrmModuleOptions {
        console.log(this.dbConfig);

        return {
            type: "postgres",
            host: this.dbConfig.host,
            port: this.dbConfig.port,
            username: this.dbConfig.username,
            password: this.dbConfig.password,
            database: this.dbConfig.database,
            synchronize: true,
            logging: false,
            autoLoadEntities: true,
            // migrationsRun: true,
            // migrations: ["dist/migrations/*migration.js"],
            // entities: ["dist/**/entities/*.entity.{js,ts}"],
        };
    }
}
