import { applyDecorators, Type } from '@nestjs/common';
import {
    ApiExtraModels,
    ApiResponse,
    ApiResponseOptions,
    getSchemaPath,
} from '@nestjs/swagger';

import { StandardHttpResponseDto } from '@/core/dtos/standard-http-response.dto';

export const ApiStandardisedResponse = <DataDto extends Type<unknown>>(
    apiReponseOptions: ApiResponseOptions,
    dataDto: DataDto,
) =>
    applyDecorators(
        ApiExtraModels(StandardHttpResponseDto, dataDto),
        ApiResponse({
            ...apiReponseOptions,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(StandardHttpResponseDto) },
                    {
                        properties: {
                            data: {
                                $ref: getSchemaPath(dataDto),
                            },
                        },
                    },
                ],
            },
        }),
    );
