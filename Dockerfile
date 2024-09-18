FROM node:20

WORKDIR /app

COPY . .

RUN yarn install --quiet --no-optional --no-fund --loglevel=error

EXPOSE 3000