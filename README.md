## How to run the script

1. Have installed `node`, `npm` and `Google Chrome`

Note: use latest `node` version or `8.9.4`.

2. Clone source code

```
git clone https://github.com/renderforest/project-creator.git

cd project-creator
```

3. Run the following command to install dependencies

```
npm i
```

4. Provide the following envirenment variables before running the script

| Name               | Description                                       |
|--------------------|---------------------------------------------------|
| JSON_FILE_PATH     | JSON file path that contains project screens data |
| RF_SIGN_KEY        | Sign key provided by Renderforest                 |
| RF_CLIENT_ID       | Client id provided by Renderforest                |

5. Run the following command to start creating a project with screens information provided in JSON file

```
npm start
```