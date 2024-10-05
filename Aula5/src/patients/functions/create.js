import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import { createPatient } from "../patients.service.js";

const create = async (event) => {
  const patient = await createPatient(event.body);

  return {
    statusCode: 201,
    body: JSON.stringify(patient),
  };
};

export const handler = middy()
.use(httpJsonBodyParser())
.use(httpErrorHandler())
.handler(create);