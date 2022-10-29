FROM node:alpine3.16

# Create app directory
WORKDIR /usr/src/app

# Copy app source
COPY . .

# Install app dependencies
RUN npm install && echo "0 6 * * 1 /usr/src/app node src/index.js" >> /etc/crontabs/root

# Run app
CMD [ "crond", "-f" ]
