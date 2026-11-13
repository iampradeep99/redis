# lms-redis

A CommonJS wrapper around `redis` with a shared client and JSON cache helpers.
Requires Node.js 18 or later and a running Redis server.

## Install

```sh
npm install lms-redis
```

## Usage

```js
const redis = require('lms-redis')();

async function main() {
  const client = await redis.connectRedis({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  try {
    await redis.setCache('user:123', { name: 'Alice' }, 60);
    console.log(await redis.getCache('user:123')); // { name: 'Alice' }
    await redis.deleteCache('user:123');
  } finally {
    await client.quit();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

## API

Call the exported factory (`require('lms-redis')()`) to access the helpers.
All factory calls share one client per loaded module. Connect once at application
startup and close the client when the application shuts down.

- `connectRedis(options)`: connects using the required `options.url` and returns
  the Redis client. Other options are passed to `redis.createClient`. Subsequent
  calls return the existing client; they do not change its configuration or reconnect it.
- `getClient()`: returns the initialized client for direct Redis commands.
- `setCache(key, value, ttlInSec = 3600)`: stores a JSON-serializable value with
  an expiry in seconds. Use a positive integer for the TTL.
- `getCache(key)`: parses the stored JSON value, or returns `null` for a missing
  key. Values written outside this wrapper must also be valid JSON.
- `deleteCache(key)`: deletes a key.

Await `connectRedis` before using the cache helpers. Connection and command errors
reject their promises and should be handled by the calling application.

## Publishing

```sh
npm run check
npm pack --dry-run
npm login
npm publish --access public
```

The npm account must have permission to publish `lms-redis`. If that name is
unavailable, update the name in `package.json` and run
`npm install --package-lock-only` to synchronize the lockfile. For later releases,
choose a new version before publishing; npm does not allow reusing a published
name and version.

## License

MIT. See [LICENSE](LICENSE).
