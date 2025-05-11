const swaggerJSDoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyGreenZone API',
      version: '1.0.0',
      description: 'API Documentation for MyGreenZone'
    },
  },
  apis: ["./**/*.route.js"], 
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
