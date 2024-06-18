import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger as PinoLogger } from 'nestjs-pino';

import { AppModule } from '@/application/app.module';
import { MainConfigService } from '@/application/config/configs/main-config.service';

const bootstrap = async () => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        snapshot: true,
        abortOnError: process.env.NODE_ENV === 'production',
        bufferLogs: true,
        rawBody: true,
    });

    const logger = new Logger('bootstrap');

    const mainConfig = app.get(MainConfigService);

    app.useGlobalPipes(new ValidationPipe());
    app.useLogger(app.get(PinoLogger));

    app.use(helmet());
    app.enableCors();
    app.enableVersioning();
    app.enableShutdownHooks();

    const config = new DocumentBuilder()
        .setTitle('Journal API')

        .setExternalDoc('Postman Collection', '/openapi-json')
        .setVersion('1.0')

        .addSecurity('apiKey', {
            'x-tokenName': 'x-api-key',
            in: 'header',
            type: 'apiKey',
            name: 'x-api-key',
        })
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('openapi', app, document);

    await app
        .listen(mainConfig.PORT)
        .then(() => {
            logger.log(`Application is running on port ${mainConfig.PORT}`);
        })
        .catch((error) => {
            logger.error(error);

            process.exit(1);
        });
};

bootstrap().catch((error: unknown) => {
    // eslint-disable-next-line no-console -- This is a CLI application
    console.error(error);
    process.exit(1);
});
