# letcode-frontend

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
npx prettier --write .
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### API Generation From Backend
```
openapi -i http://localhost:8101/api/v2/api-docs -o ./generated
```
