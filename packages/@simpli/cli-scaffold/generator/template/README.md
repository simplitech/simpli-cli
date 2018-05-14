<p align="center">
  <img alt="Simpli Logo" src="https://raw.githubusercontent.com/simplitech/simpli-cli/master/docs/img/logo.png" width="256" height="256">
  <br>
  <a href="https://www.npmjs.com/package/@simpli/cli"><img src="https://img.shields.io/npm/v/@simpli/cli.svg"></a>
  <a href="https://www.npmjs.com/package/@simpli/cli"><img src="https://img.shields.io/npm/dt/@simpli/cli.svg"></a>
  <a href="https://www.npmjs.com/package/@simpli/cli"><img src="https://img.shields.io/npm/l/@simpli/cli.svg"></a>
</p>

# Simpli CLI Client Project

Go to your project directory root and run:

```sh
$ npm run serve
```
to enter on `development mode`. Or run:
```sh
$ npm run build
```
to build for `production mode`.

When you enter on `dev`, you may see this screen at `localhost:8181`:

![Client Running](https://raw.githubusercontent.com/simplitech/simpli-cli/master/docs/img/client-img3.png)
> The default login from generated `data.sql` located in server project is `test@test.com` and the password is `tester`

#### _Important_
> The password column of your login table must be encrypted by `double SHA-256`. E.g.: The password `123456` should be `49dc52e6bf2abe5ef6e2bb5b0f1ee2d765b922ae6cc8b95d39dc06c21c848f8c` in the password column.

---
