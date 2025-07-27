FROM node:22.17.0
WORKDIR /usr/src/app
COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm install 

CMD [ "pnpm", "start" ]
