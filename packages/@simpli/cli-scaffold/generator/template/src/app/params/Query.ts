export default class Query {
  constructor(
    public query?: string,
    public page?: number,
    public limit?: number,
    public orderBy?: string,
    public ascending?: boolean,
  ) {/**/}
}
