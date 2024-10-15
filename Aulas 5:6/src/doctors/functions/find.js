import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpContentNegotiation from "@middy/http-content-negotiation";
import httpResponseSerializer from "@middy/http-response-serializer";
import DoctorsService from "../doctors.service.js";

const findAll = async (event) => {
  const doctors = await DoctorsService.findAll();

  return {
    statusCode: 200,
    body: doctors,
  };
};

const findById = async (event) => {
  const { id } = event.pathParameters;
  const doctor = await DoctorsService.findOneById(id);

  if (!doctor) {
    return {
      statusCode: 404,
      body: "Doctor not found",
    };
  }

  return {
    statusCode: 200,
    body: doctor,
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