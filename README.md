# Plex Performance Monitor

Plex Performance Monitor is a an self-hosted multi-tenent plex client performance monitor.

  
# Stack
Plex Performance Monitor uses a number of open source projects to work properly, Thanks to:

  - [React](https://reactjs.org)
  - [Socket.io](https://socket.io/)
  - [Redis](https://redis.io/)
  - [NodeJS](https://nodejs.org)

And of course Plex Performance Monitor itself is open source on GitHub.

### Installation

Plex Performance Monitor requires [Node.js](https://nodejs.org/) v7+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd plex-server-perfmon
$ npm install -d
$ node app
```

For production environments...

```sh
$ npm install --production
$ NODE_ENV=production node app
```

### Todos

 - Write tests
 - Improve UI

License
----

MIT
