const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'PhilTech INC. API',
        description: 'PhilTech INC. API Information',
    },
    host: 'localhost:5000',
    schemes: ['http'],
};

const outputFile = '../swagger-output.json';
const endpointFiles = ['../src/index.js'];

swaggerAutogen(outputFile, endpointFiles, doc).then(() => {
    require('../src/index.js')
})