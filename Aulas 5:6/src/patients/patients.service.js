import dynamoose from "dynamoose";
import { PatientDynamoSchema } from "./patients.schema.js";
import crypto from "node:crypto";
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

const PatientModel = dynamoose.model("Patient", PatientDynamoSchema, {
  create: false,
  waitForActive: false,
});

async function createPatient(payload) {
  payload.id = crypto.randomUUID();

  payload.birthDate = payload.birthDate
    ? new Date(payload.birthDate)
    : undefined;

  payload.PK = `PATIENT#${payload.id}`;

  const result = await PatientModel.create(payload);

  result.PK = undefined;

  return result;
}

async function findOneById(id) {
  const result = await PatientModel.get({ PK: `PATIENT#${id}` });

  if (result) {
    result.PK = undefined;
  }

  return result;
}

async function findAll() {
  const result = await PatientModel.scan().exec();

  return result.map((item) => {
    item.PK = undefined;
    return item;
  });
}

async function update(id, payload) {
  const patient = await PatientModel.get({ PK: `PATIENT#${id}` });

  if (!patient) {
    return null;
  }

  if (payload.birthDate) {
    payload.birthDate = new Date(payload.birthDate);
  }

  const updatedPayload = {
    ...payload,
  };

  const result = await PatientModel.update(
    { PK: `PATIENT#${id}` },
    updatedPayload
  );

  result.PK = undefined;

  return result;
}

async function deleteById(id) {
  await PatientModel.delete({ PK: `PATIENT#${id}` });

  return { message: "Patient deleted successfully" };
}

async function notifyPatientCreated(patient) {
  const client = new EventBridgeClient({});

  await client.send(
    new PutEventsCommand({
      Entries: [
        {
          Source: "aula5-clinica",
          DetailType: "PatientCreated",
          Detail: JSON.stringify({ patient }),
        },
      ],
    })
  );
}

export default {
  createPatient,
  findAll,
  findOneById,
  update,
  deleteById,
  notifyPatientCreated,
};
