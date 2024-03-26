# syntax=docker/dockerfile:1
#
# Caution: this Dockerfile it is not really optimized, as we re-install dependencies every time any file change in a directory.
# This is because of the really long time to compress & push the docker cache layers with node_modules on gitlab-ci.
#
# You must save the buildkit cache mounts between 2 pipelines in order to keep the cache.
# This is not possible by default on gitlab, but you can do it by sharing buildkit cache between dind, buildkit & the job runner
# See https://github.com/dashevo/gh-action-cache-buildkit-state and this project's .gitlab-ci.yml file
#
# If you want to inspect cache layers:
#    docker buildx build --load -t foo -f docker/server/Dockerfile --target api-builder --progress=plain .
#    dive foo || docker history foo
#
# -----------------------------------
FROM docker.io/node:20-alpine as api-builder

WORKDIR /srv/api

COPY api/package*.json ./

RUN --mount=type=cache,id=npmcache,sharing=locked,target=/root/.cache \
    npm ci --no-audit --prefer-offline --cache "/root/.cache/.npm" --omit=dev --loglevel info \
    && mv node_modules /tmp/node_modules_prod

COPY api .

RUN --mount=type=cache,id=npmcache,sharing=locked,target=/root/.cache \
    --mount=type=tmpfs,target=/srv/api/node_modules \
    npm ci --no-audit --prefer-offline --cache "/root/.cache/.npm" --loglevel info; \
    npm run build; \
    mv package.json package-lock.json dist/;

# -----------------------------------
FROM alpine:3.19 as server

RUN apk add --update --no-cache nodejs
RUN adduser --disabled-password --no-create-home -g web web

ENV HTTP_PORT=8080
ENV LOGGER=json

EXPOSE 8080
ENTRYPOINT ["/usr/bin/entrypoint"]
HEALTHCHECK --interval=10s --timeout=20s --start-period=3s --retries=3 CMD wget --no-verbose --tries=1 --spider "http://127.0.0.1:${HTTP_PORT}/health" 1>/dev/null || exit 1
STOPSIGNAL SIGQUIT

WORKDIR /srv

USER web

COPY docker/server/bin/entrypoint /usr/bin/entrypoint
COPY --from=api-builder /tmp/node_modules_prod /srv/node_modules
COPY --from=api-builder /srv/api/dist /srv

# Inject the current git tag as an ENV variable
ARG BUILD_TAG=local
ENV BUILD_TAG=$BUILD_TAG
