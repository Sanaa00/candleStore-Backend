import swaggerJSDoc from "swagger-jsdoc";

const option = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Candle Store app",
      description: "an application to sell candles ",
      version: "1.0.0",
    },
  },
  servers: [{ url: "http://localhost:8080" }],
  apis: ["./routes/*.js"],
};

export const swaggerSpecs = swaggerJSDoc(option);
