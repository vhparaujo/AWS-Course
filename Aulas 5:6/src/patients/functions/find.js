import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpContentNegotiation from "@middy/http-content-negotiation";
import httpResponseSerializer from "@middy/http-response-serializer";
import PatientsService from "../patients.service.js";

const findAll = async (event) => {
  const patients = await PatientsService.findAll();

  return {
    statusCode: 200,
    body: patients,
  };
};

const findById = async (event) => {
  const { id } = event.pathParameters;
  const patient = await PatientsService.findOneById(id);

  if (!patient) {
    return {
      statusCode: 404,
      body: "Patient not found",
    };
  }

  return {
    statusCode: 200,
    body: patient,
  };
};

export const findHandler = middy()
  .use(httpHeaderNormalizer())
  .use(httpContentNegotiation())
  .use(
    httpResponseSerializer({
      serializers: [
        {
          regex: /^application\/xml$/,
          serializer: ({ body }) => `<message>${body}</message>`,
        },
        {
          regex: /^application\/json$/,
          serializer: ({ body }) => JSON.stringify(body),
        },
        {
          regex: /^text\/plain$/,
          serializer: ({ body }) => body,
        },
      ],
      defaultContentType: "application/json",
    })
  )
  .use(httpErrorHandler())
  .use(httpJsonBodyParser({ disableContentTypeError: true }))
  .handler(findAll);

export const findByIdHandler = middy()
.use(httpHeaderNormalizer())
.use(httpContentNegotiation())
.use(
  httpResponseSerializer({
    serializers: [
      {
        regex: /^application\/xml$/,
        serializer: ({ body }) => `<message>${body}</message>`,
      },
      {
        regex: /^application\/json$/,
        serializer: ({ body }) => JSON.stringify(body),
      },
      {
        regex: /^text\/plain$/,
        serializer: ({ body }) => body,
      },
    ],
    defaultContentType: "application/json",
  })
)
.use(httpErrorHandler())
.use(httpJsonBodyParser({ disableContentTypeError: true }))
.handler(findById);