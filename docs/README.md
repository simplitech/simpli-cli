<p align="center">
  <img alt="Simpli Logo" src="https://raw.githubusercontent.com/simplitech/simpli-cli/master/docs/img/logo.png" width="256" height="256">
  <br>
  <a href="https://www.npmjs.com/package/@simpli/cli"><img src="https://img.shields.io/npm/v/@simpli/cli.svg"></a>
  <a href="https://www.npmjs.com/package/@simpli/cli"><img src="https://img.shields.io/npm/dt/@simpli/cli.svg"></a>
  <a href="https://www.npmjs.com/package/@simpli/cli"><img src="https://img.shields.io/npm/l/@simpli/cli.svg"></a>
</p>

# Simpli CLI

* [About](#about)
* [Getting Started](#getting-started)
* [Commands](#commands)

## About
Simpli CLI provides tools to generate either web-server or web-client projects based on a MySQL database scheme.

---

### Server Project

> Client projects are generated based on your `MySQL database`, and it provides `Restful APIs`, including `Login API`. Once you have built your server, you may use the `IntelliJ` or `NetBeans` in order to run your server. I will assume you know how to use Tomcat Server and Maven.

#### Requirements
	- Maven
	- Tomcat Server with Catalina
	- MySQL Server

#### Features included
	- Kotlin Language
	- Login API
	- API Router
	- API Process
	- MySQL Table Models
	- Data Access Object (DAO)
	- Persist Validation
	- Locale support (en-US and pt-BR included)
	- Swagger Documentation
	- Unit Test

#### Structure
```
project-root/
    src/
        resource/
        main/
            java/
                crud/
                    process/
                    response/
                dao/
                model/
            webapp/
                META-INF/
                WEB-INF/
        test/
            java/
                crud/
                    process/
                model/
```

---

### Client Project

> Client projects are generated based on `swagger.json` which can be found in server projects. It provides an interface with `CRUDs`, including `Login System`. Also, `SimpliPack` classes support you to easily develop your platform system. Access the [simpli-ts-vue documentation](https://github.com/simplitech/simpli-ts-vue) to further information.

#### Requirements
```
- Node.js with NPM
```

#### Features included
	- Typescript Language
	- Login System
	- SimpliPack Classes
	- Serialized API responses into Models
	- Locale support (en-US and pt-BR included)
	- Persist Validation
	- Webpack with hot-reload
	- VUE with SPA (VueRouter)
	- VUEX
	- SCSS
	- TSLint

#### Structure
```
project-root/
    public/
        img/
    src/
        assets/
            img/
        bootstrap/
        components/
            modals/
        config/
        helpers/
            vuex/
        locale/
        model/
            collection/
            resource/
            response/
        scss/
        store/
            modules/
        types/
        views/
            layouts/
            list/
            persist/
```

---

## Getting Started

Let's start by installing Simpli CLI globally with [npm](https://www.npmjs.com/).

```sh
$ npm install -g @simpli/cli
```

Once you have installed, simply go to your workspace directory and run the following:

```sh
$ simpli new:project [project-name]
```

You may now choose between `Server Project` and `Client Project`.

---

### Server Project Prompt

When you choose the `Server Project`, you have to provide your MySQL access with the chosen database:

![Server Prompt MySQL Access](https://raw.githubusercontent.com/simplitech/simpli-cli/master/docs/img/server-img1.png)

Then, fill the rest of the prompt and confirm. Follow this example:

![Server Prompt Example](https://raw.githubusercontent.com/simplitech/simpli-cli/master/docs/img/server-img2.png)

Once you have run your generated server, you may access `localhost:8080` (it can vary depending on your Tomcat configuration):

![Server Running](https://raw.githubusercontent.com/simplitech/simpli-cli/master/docs/img/server-img3.png)

Copy the swagger URL in order to generate the `Client Project`.

---

### Client Project Prompt

When you choose the `Client Project`, you have to provide the swagger URL found in your `Server Project`:

![Client Prompt Swagger Request](https://raw.githubusercontent.com/simplitech/simpli-cli/master/docs/img/client-img1.png)

Then, fill the rest of the prompt and confirm. Follow this example:

![Client Prompt Example](https://raw.githubusercontent.com/simplitech/simpli-cli/master/docs/img/client-img2.png)

Once you have generated the client, go to your project directory and run:

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

#### _Important_
> The password column of your login table must be encrypted by `double SHA-256`. E.g.: The password `123456` should be `49dc52e6bf2abe5ef6e2bb5b0f1ee2d765b922ae6cc8b95d39dc06c21c848f8c` in the password column.

---

## Commands

> Check it out the Simpli CLI commands

* [New Project](#new-project)
* [Scaffold Inspect](#scaffold-inspect)
* [Scaffold Sync](#scaffold-sync)
* [Server Inspect](#server-inspect)
* [Server Sync](#server-sync)

---

### New Project

#### Usage

```sh
$ simpli new:project [options] <project-name>
```

> Create a new simpli project

```
<project-name> : The name of your root project directory
```

#### Options

```
-d, --default		skip prompts and use default preset
-f, --force		overwrite target directory if it exists
-h, --help		output usage information
```

---

### Scaffold Inspect

#### Usage

```sh
$ simpli scaffold:inspect [options] [paths...]
```

> inspect the models and APIs based on swagger

```
[paths...] : The path of a model or API
```

#### Options

```
-h, --help		output usage information
```
#### Example

```sh
$ simpli scaffold:inspect api.signIn
```

![Scaffold Inspect Example](https://raw.githubusercontent.com/simplitech/simpli-cli/master/docs/img/client-inspect-example.png)

---


### Scaffold Sync

#### Usage

```sh
$ simpli scaffold:sync [options]
```

> synchronize the models of the current frontend project based on its web server swagger


#### Options

```
-h, --help		output usage information
```

---

### Server Inspect

#### Usage

```sh
$ simpli server:inspect [options] [paths...]
```

> inspect the tables of a MySQL database

```
[paths...] : The path of a table
```

#### Options

```
-h, --help		output usage information
```
#### Example

```sh
$ simpli server:inspect table.user.columns
```

![Server Inspect Example](https://raw.githubusercontent.com/simplitech/simpli-cli/master/docs/img/server-inspect-example.png)

---


### Server Sync

#### Usage

```sh
$ simpli server:sync [options]
```

> synchronize the tables of the current backend project based on its MySQL database


#### Options

```
-h, --help		output usage information
```

---
