/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from "./ApiRequestOptions";

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

export type OpenAPIConfig = {
  BASE: string;
  VERSION: string;
  WITH_CREDENTIALS: boolean;
  CREDENTIALS: "include" | "omit" | "same-origin";
  TOKEN?: string | Resolver<string> | undefined;
  USERNAME?: string | Resolver<string> | undefined;
  PASSWORD?: string | Resolver<string> | undefined;
  HEADERS?: Headers | Resolver<Headers> | undefined;
  ENCODE_PATH?: ((path: string) => string) | undefined;
};
export const OpenAPI: OpenAPIConfig = {
  // 在开发环境下，BASE 为 /api，通过 Vue CLI 代理；在生产环境下，使用实际的后端服务器地址
  // BASE: "http://127.0.0.1:8101",
  // BASE: process.env.NODE_ENV === 'development' ? '/api' : 'http://LetCodeLB-457706603.ap-southeast-1.elb.amazonaws.com:8101',
  BASE: process.env.NODE_ENV === 'development' ? '/api' : 'http://43.134.114.17',
  VERSION: "1.0",
  WITH_CREDENTIALS: true, // 允许携带 Cookie 和其他凭证
  CREDENTIALS: "include",
  TOKEN: undefined,
  USERNAME: undefined,
  PASSWORD: undefined,
  HEADERS: undefined,
  ENCODE_PATH: undefined,
};
