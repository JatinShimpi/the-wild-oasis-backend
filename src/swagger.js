import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "The Wild Oasis API",
            version: "1.0.0",
            description: "API for The Wild Oasis hotel management system",
            contact: {
                name: "Support",
                email: "support@thewildoasis.com",
            },
        },
        servers: [
            {
                url: "http://localhost:8000/api/v1",
                description: "Development server",
            },
            {
                url: "<YOUR_KOYEB_URL>/api/v1",
                description: "Production server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.js"], // Path to the API docs
};

export const swaggerSpecs = swaggerJsdoc(options);
