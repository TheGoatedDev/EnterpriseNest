import 'reflect-metadata';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { Logger as PinoLogger } from 'nestjs-pino';

import { AppModule } from '@/application/app.module';
import { MainConfigService } from '@/infrastructure/config/configs/main-config.service';
import { StandardHttpResponseInterceptor } from '@/shared/interceptors/standard-http-response.interceptor';
import { otelSDK } from '@/shared/utilities/tracing';

const bootstrap = async () => {
    otelSDK.start();

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        snapshot: true,
        abortOnError: process.env.NODE_ENV === 'production',
        bufferLogs: true,
        rawBody: true,
    });

    // Getting the logger
    const logger = new Logger('bootstrap');

    // Getting the MainConfigService
    const mainConfig = app.get(MainConfigService);

    // Setting up the global pipes and interceptors
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new StandardHttpResponseInterceptor());
    app.useLogger(app.get(PinoLogger));

    // Express Middleware
    app.use(helmet()); // Helmet is a collection of 14 smaller middleware functions that set security-related HTTP headers

    // Proxy Specific Setup
    if (mainConfig.BEHIND_PROXY) {
        logger.warn('Application is behind a proxy');

        // Trusting the proxy
        app.set('trust proxy', true);

        // Enabling compression
        app.use(compression({}));
    }

    // Enabling NestJS features
    app.enableCors();
    app.enableVersioning();
    app.enableShutdownHooks();

    // Swagger/OpenAPI Setup
    const config = new DocumentBuilder()
        .setTitle(`${mainConfig.APP_NAME} API`)
        .setExternalDoc('Postman Collection', '/openapi-json')
        .setVersion('1.0')
        .addBearerAuth(undefined, 'access-token')
        .addBearerAuth(undefined, 'refresh-token')
        .addSecurityRequirements('access-token')
        .build();
    const document = SwaggerModule.createDocument(app, config);

    if (mainConfig.NODE_ENV !== 'production') {
        SwaggerModule.setup('openapi', app, document);
    }

    // Starting the application
    await app
        .listen(mainConfig.PORT)
        .then(() => {
            logger.log(
                `Application is running on port ${mainConfig.PORT.toString()}`,
            );
        })
        .catch((error: unknown) => {
            logger.error(error);

            process.exit(1);
        });
};

bootstrap().catch((error: unknown) => {
    // eslint-disable-next-line no-console -- This is a CLI application
    console.error(error);
    process.exit(1);
});
