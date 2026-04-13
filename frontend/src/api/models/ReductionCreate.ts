/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReductionStatusEnum } from './ReductionStatusEnum';
import type { ReductionTypeEnum } from './ReductionTypeEnum';
export type ReductionCreate = {
    source_id: string;
    target_id: string;
    type?: ReductionTypeEnum;
    technique?: (string | null);
    status?: ReductionStatusEnum;
    runtime_relation?: (Record<string, any> | null);
};
