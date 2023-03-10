<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Execution in dev environment

1. Clone this repository.
2. Execute the following command

```bash
yarn install
```

3. Must have Nest CLI installed

```bash
npm i -g @nestjs/cli
```

4. Copy the .env file
```bash
cp .env-example .env
```

5. Start the database container service

```bash
docker-compose up -d
```

6. Seed the database using cURL
```
curl http://localhost:3000/seed
```


## Stack used
* MongoDB
* NestJS
