import {Resp} from '@/types/app'
import HttpBody from '@/app/http/HttpBody'
import {HttpResponse} from 'vue-resource'
import {Resource} from '@/app/http/Resource'

export type ID = number | string | undefined
export type TAG = string | undefined
export interface Scheme { readonly [column: string]: string | number | undefined }

export interface Resp<T> {
  data: T
  ok: boolean
  status: number
  statusText: string
  headers: Function
  text(): string
  json(): any
  blob(): Blob
}

export interface IHttpBody {
  call(promise: PromiseLike<HttpResponse>): PromiseLike<Resp<this>>
  GET(uri: string): Promise<Resp<this>>
  POST(uri: string, body?: any): Promise<Resp<this>>
  PUT(uri: string, body?: any): Promise<Resp<this>>
  DELETE(uri: string): Promise<Resp<this>>
  clone(entity: any): void
}

export interface IResource {
  readonly $name: string
  readonly $endpoint: string
  $id: ID
  $tag: TAG
  find(id: ID): Promise<Resp<this>>
  findByQuery(query: any): Promise<Resp<this>>
  save(modelResp: HttpBody): Promise<Resp<HttpBody>>
  update(modelResp: HttpBody): Promise<Resp<HttpBody>>
  remove(modelResp: HttpBody): Promise<Resp<HttpBody>>
  scheme(): Scheme
  csvScheme(): Scheme
  validateAndSave(modelResp: HttpBody): Promise<Resp<HttpBody>>
  validateAndUpdate(modelResp: HttpBody): Promise<Resp<HttpBody>>
}

export interface ICollection<T> {
  readonly items: T[]
  readonly type: any
  readonly resource: Resource
  readonly headers: {readonly [key: string]: string}
  readonly rows: any[][]
  values(i: number): any[]
  query(modelResp: HttpBody): Promise<Resp<this>>
  downloadCsv(): void
}

export interface IPageCollection {
  total: number
  querySearch: string
  currentPage?: number
  perPage?: number
  orderBy?: string
  asc: boolean
  debounce: Function
  lastPage: number
  search(): Promise<Resp<this>>
  setOrderBy(column: string): Promise<Resp<this>>
  setCurrentPage(val: number): Promise<Resp<this>>
  searchByQuery(): Promise<Resp<this>>
  prevPage(): Promise<Resp<this>>
  nextPage(): Promise<Resp<this>>
}

export interface IValidator {
  validateFirstError?(): Promise<void>
  validate(): Promise<void>
}
