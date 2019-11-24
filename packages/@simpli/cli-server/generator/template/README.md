<p align="center">
  <img alt="Simpli CLI" src="https://raw.githubusercontent.com/simplitech/simpli-cli/master/logo.png" width="256" height="256">
  <br>
  <a href="https://www.npmjs.com/package/@simpli/cli"><img src="https://img.shields.io/npm/v/@simpli/cli.svg"></a>
  <a href="https://www.npmjs.com/package/@simpli/cli"><img src="https://img.shields.io/npm/dt/@simpli/cli.svg"></a>
  <a href="https://www.npmjs.com/package/@simpli/cli"><img src="https://img.shields.io/npm/l/@simpli/cli.svg"></a>
</p>

### Simpli CLI Server Project

Make sure the port 8080 is not in use.

Go to your project directory root and seed your database:

```sh
$ simpli server:seed
```

Then, run this shell:

```sh
$ sh build.sh
```

This command will use the `mvn` CLI and the `docker` CLI.
Therefore, it should have those installed.

Go to `localhost:8080`

![Server Running](https://raw.githubusercontent.com/simplitech/simpli-cli/master/docs/img/server-img3.png)

Copy the swagger URL in order to generate the `Client Project`.

### Generating Fake Data

Another useful feature of Simpli CLI is `Fake Data`. This data can be found in `root-project/src/test/resources/database/data.sql`.
If you could not find it, go to the root of project and generate the `data.sql` by running `simpli new:seed`. Then run `simpli server:seed` to populate the fake data into your database.

> The default login is `test@test.com` and the password is `tester`

#### _Important_

Make sure your database is used for testing because the command `simpli server:seed` will TRUNCATE your tables.

---
