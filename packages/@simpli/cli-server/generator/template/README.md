<p align="center">
  <img alt="Simpli Logo" src="https://raw.githubusercontent.com/simplitech/simpli-cli/master/docs/img/logo.png" width="256" height="256">
  <br>
  <a href="https://www.npmjs.com/package/@simpli/cli"><img src="https://img.shields.io/npm/v/@simpli/cli.svg"></a>
  <a href="https://www.npmjs.com/package/@simpli/cli"><img src="https://img.shields.io/npm/dt/@simpli/cli.svg"></a>
  <a href="https://www.npmjs.com/package/@simpli/cli"><img src="https://img.shields.io/npm/l/@simpli/cli.svg"></a>
</p>

### Simpli CLI Server Project

Go to your project directory root and seed your database:

```sh
$ simpli server:seed
```

Then, generate the War file:

```sh
$ mvn package
```

Then, initialize the Tomcat and move the WAR file to tomcat folder to deploy it:

```sh
$ tomcat start
$ mv <warfile> <tomcat-webapps-location>
```

Once you have run your generated server, you may access `localhost:8080/[WAR-file-name]` (it can vary depending on your Tomcat configuration):

![Server Running](https://raw.githubusercontent.com/simplitech/simpli-cli/master/docs/img/server-img3.png)

Copy the swagger URL in order to generate the `Client Project`.

### Generating Fake Data

Another useful feature of Simpli CLI is `Fake Data`. This data can be found in `root-project/src/test/resources/database/data.sql`.
If you could not find it, go to the root of project and generate the `data.sql` by running `simpli new:seed`. Then run `simpli server:seed` to populate the fake data into your database.

> The default login is `test@test.com` and the password is `tester`

#### _Important_

Make sure your database is used for testing because the command `simpli server:seed` will TRUNCATE your tables.

---
