import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import swagger from "./shared/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    swagger.configure(app);
    app.useGlobalPipes(new ValidationPipe({ always: true, whitelist: true }));
    await app.listen(3000);
}
bootstrap();
