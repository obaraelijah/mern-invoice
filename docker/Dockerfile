ARG NODE_VERSION=16-alpine3.12

FROM node:${NODE_VERSION}

LABEL name="mern-invoice"
LABEL license="MIT"
LABEL description="MERN invoice image"

ENV NODE_ENV=development

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

# Creates a system group and a system user within the container
RUN addgroup --system invoice && adduser --system --ingroup invoice invoice


COPY package*.json ./

RUN npm install

# Copy the application code into the working directory with correct ownership
COPY --chown=invoice:invoice . ${APP_HOME}

#Change ownership of the working directory to the 'invoice' user
RUN chown invoice:invoice ${APP_HOME}

USER invoice

CMD [ "npm","run","dev" ]