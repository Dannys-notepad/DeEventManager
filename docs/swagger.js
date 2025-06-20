const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'De Event Manager API',
      version: '1.0.0',
      description: 'An Headless Backend API for managing eventss',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
  },
  apis: ['./src/modules/**/**.route.js'], 
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;

