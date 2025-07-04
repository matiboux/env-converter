# Env Converter

<!-- Uses `matiboux/astro-template` on commit `fce93abbe4d7fc43c21f7ec62d27f52457d311c7`. -->

Online conversion tool for environment files.


## Building locally

## Development

Use this command to run the site locally for development:

```bash
docker compose watch
# or: docker compose up
```

Using `watch`, you'll benefit from file changes watching for sync & rebuild.

The site will be served at [http://localhost:8080](http://localhost:8080).

### Production

Use this command to run the site locally for production:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
# or: docker compose -f docker-compose.yml up
```

The site will be served at [http://localhost:8080](http://localhost:8080).


## License

Copyright (c) 2024 [Matiboux](https://github.com/matiboux) ([matiboux.me](https://matiboux.me))

Licensed under the [MIT License](https://opensource.org/license/MIT). You can see a copy in the [LICENSE](LICENSE) file.
