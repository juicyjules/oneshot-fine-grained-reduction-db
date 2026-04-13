/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ProblemCreate } from '../models/ProblemCreate';
import type { ProblemRead } from '../models/ProblemRead';
import type { ReductionCreate } from '../models/ReductionCreate';
import type { ReductionRead } from '../models/ReductionRead';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CoreService {
    /**
     * Get Problems
     * @returns ProblemRead Successful Response
     * @throws ApiError
     */
    public static getProblemsApiProblemsGet(): CancelablePromise<Array<ProblemRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/problems',
        });
    }
    /**
     * Create Problem
     * @param requestBody
     * @returns ProblemRead Successful Response
     * @throws ApiError
     */
    public static createProblemApiProblemsPost(
        requestBody: ProblemCreate,
    ): CancelablePromise<ProblemRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/problems',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Problem
     * @param problemId
     * @returns ProblemRead Successful Response
     * @throws ApiError
     */
    public static getProblemApiProblemsProblemIdGet(
        problemId: string,
    ): CancelablePromise<ProblemRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/problems/{problem_id}',
            path: {
                'problem_id': problemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Reductions
     * @returns ReductionRead Successful Response
     * @throws ApiError
     */
    public static getReductionsApiReductionsGet(): CancelablePromise<Array<ReductionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reductions',
        });
    }
    /**
     * Create Reduction
     * @param requestBody
     * @returns ReductionRead Successful Response
     * @throws ApiError
     */
    public static createReductionApiReductionsPost(
        requestBody: ReductionCreate,
    ): CancelablePromise<ReductionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/reductions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
