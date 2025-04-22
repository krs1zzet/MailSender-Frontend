FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install

# Set API URL during build
ARG REACT_APP_API_URL=http://54.172.234.3:8080
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a script to replace environment variables at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo 'sed -i "s|__REACT_APP_API_URL__|${REACT_APP_API_URL:-http://54.172.234.3:8080}|g" /usr/share/nginx/html/main*.js' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 8083

# Start the application
ENTRYPOINT ["/docker-entrypoint.sh"]
