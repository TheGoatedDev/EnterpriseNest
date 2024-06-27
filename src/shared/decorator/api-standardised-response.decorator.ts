import { applyDecorators, Type } from '@nestjs/common';
import {
    ApiExtraModels,
    ApiResponse,
    ApiResponseOptions,
    getSchemaPath,
} from '@nestjs/swagger';

import { StandardHttpResponseDto } from '@/shared/dto/standard-http-response.dto';

export const ApiStandardisedResponse = <DataDto extends Type<unknown>>(
    apiReponseOptions: ApiResponseOptions,
    dataDto?: DataDto,
) =>
    applyDecorators(
        ApiExtraModels(StandardHttpResponseDto, ...(dataDto ? [dataDto] : [])),
        ApiResponse({
            ...apiReponseOptions,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(StandardHttpResponseDto) },
                    {
                        ...(dataDto && {
                            properties: {
                                data: {
                                    $ref: getSchemaPath(dataDto),
                                },
                            },
                        }),
                    },
                ],
            },
        }),
    );
