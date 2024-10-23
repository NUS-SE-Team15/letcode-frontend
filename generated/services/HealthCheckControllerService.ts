/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_string_ } from '../models/BaseResponse_string_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthCheckControllerService {
    /**
     * healthCheck
     * @returns BaseResponse_string_ OK
     * @throws ApiError
     */
    public static healthCheckUsingGet(): CancelablePromise<BaseResponse_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/health',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
