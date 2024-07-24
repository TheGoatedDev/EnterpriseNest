import { applyDecorators, Type } from '@nestjs/common';
import {
    ApiExtraModels,
    ApiResponse,
    ApiResponseOptions,
    getSchemaPath,
} from '@nestjs/swagger';

import { StandardHttpResponseDto } from '@/shared/dto/standard-http-response.dto';

const isStatusOK = (status: number | string) =>
    Number(status) >= 200 && Number(status) < 300;

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
                    {
                        $ref: getSchemaPath(StandardHttpResponseDto),
                    },
                    {
                        ...(dataDto
                            ? {
                                  properties: {
                                      statusCode: {
                                          type: 'number',
                                          example: apiReponseOptions.status, // Set example dynamically
                                      },
                                      data: {
                                          $ref: getSchemaPath(dataDto),
                                      },
                                  },
                              }
                            : {
                                  properties: {
                                      statusCode: {
                                          type: 'number',
                                          example: apiReponseOptions.status, // Set example dynamically
                                      },
                                      ...(isStatusOK(
                                          apiReponseOptions.status ?? 200,
                                      )
                                          ? undefined
                                          : {
                                                message: {
                                                    type: 'string',
                                                    example: 'Error message',
                                                },
                                                error: {
                                                    type: 'string',
                                                    example: 'Error name',
                                                },
                                            }),
                                  },
                              }),
                    },
                ],
            },
        }),
    );
