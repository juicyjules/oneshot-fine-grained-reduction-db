/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProblemStatusEnum } from './ProblemStatusEnum';
export type ProblemRead = {
    slug: string;
    title: string;
    description: string;
    latex_definition?: (string | null);
    complexity_class?: (string | null);
    is_assumption?: boolean;
    status?: ProblemStatusEnum;
    current_runtime?: (string | null);
    io_schema?: (Record<string, any> | null);
    id: string;
};
