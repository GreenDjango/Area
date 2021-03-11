# area-server

Node.js Server build with Express.js who expose REST API.

[![release][1]][2] [![license][7]][8]

<img src="https://vegibit.com/wp-content/uploads/2018/05/expressjs.png" alt="Express.js logo" width="70%">

## Project setup

> Edit src/config.ts for Google Auth

> Use `docker run -d -p 27017:27017 -e MONGO_INITDB_DATABASE=db mongo:latest` for debug db

```
npm i --silent --no-fund
echo -e "API_SECRET=ONLY_DEBUG\nSERVER_PORT=8080\nMONGO_CONNECTION=mongodb://localhost:27017/db" > .env
npm run serve
```

### Serve for development
```
npm run serve
```

### Transcompiles for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run unit testing
```
npm run test
```

---

[1]: https://img.shields.io/badge/release-v0.1.0-blue
[2]: https://github.com/EpitechIT2020/B-YEP-500-LYN-5-1-area-theo.cousinet/releases 'GitHub release (latest by date)'
[7]: https://img.shields.io/badge/license-MIT-green
[8]: https://github.com/EpitechIT2020/B-YEP-500-LYN-5-1-area-theo.cousinet/blob/master/LICENSE 'GitHub license'
