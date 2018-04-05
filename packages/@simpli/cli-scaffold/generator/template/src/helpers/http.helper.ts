import {HttpResponse} from 'vue-resource'
import {Resp} from '@/types/app'
import {Exclude, Expose, plainToClass, plainToClassFromExist, Type} from 'class-transformer'
import {http} from '@/helpers/prototypes.helper'
import {ApiURL} from '@/config/http.config'

export function ResponseSerialize(func: Function) {
  return Type(() => func)
}

export function ResponseFill(name?: string) {
  return Expose({name})
}

export function ResponseHidden() {
  return Exclude()
}

export const apiURL = (uri: string): string => {
  return `${ApiURL}${uri}`
}

export const call = (
  classOrObject: any,
  promise: PromiseLike<HttpResponse>,
): PromiseLike<Resp<typeof classOrObject>> => promise.then((resp: HttpResponse) => {
  const response = {
    data: undefined,
    ok: resp.ok,
    status: resp.status,
    statusText: resp.statusText,
    headers: resp.headers,
    text: resp.text,
    json: resp.json,
    blob: resp.blob,
  }

  if (typeof classOrObject === 'object') {
    // ClassObject
    response.data = plainToClassFromExist(classOrObject, resp.data) as typeof classOrObject
  } else if (typeof classOrObject === 'function') {
    // Class
    response.data = plainToClass(classOrObject, resp.data) as typeof classOrObject
  } else throw new Error('Error: Entity should be either Class or ClassObject')

  return response
})

export const GET = (classOrObject: any, uri: string): PromiseLike<Resp<typeof classOrObject>> => {
  return call(classOrObject, http.get(apiURL(uri)))
}

export const POST = (classOrObject: any, uri: string, body?: any): PromiseLike<Resp<typeof classOrObject>> => {
  return call(classOrObject, http.post(apiURL(uri), body))
}

export const PUT = (classOrObject: any, uri: string, body?: any): PromiseLike<Resp<typeof classOrObject>> => {
  return call(classOrObject, http.put(apiURL(uri), body))
}

export const DELETE = (classOrObject: any, uri: string): PromiseLike<Resp<typeof classOrObject>> => {
  return call(classOrObject, http.delete(apiURL(uri)))
}

export const enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTIPLE_CHOICES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  USE_PROXY = 305,
  TEMPORARY_REDIRECT = 307,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  REQUEST_ENTITY_TOO_LARGE = 413,
  REQUEST_URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}
