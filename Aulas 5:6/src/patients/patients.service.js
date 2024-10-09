import dynamoose from "dynamoose";
import { PatientDynamoSchema } from "./patients.schema.js";
import crypto from "node:crypto";

const PatientModel = dynamoose.model("Patient", PatientDynamoSchema, {
  create: false,
  waitForActive: false,
});

export async function createPatient(payload) {
  payload.id = crypto.randomUUID();

  payload.birthDate = payload.birthDate
    ? new Date(payload.birthDate).toISOString().split('T')[0]
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
    payload.birthDate = new Date(payload.birthDate).toISOString().split('T')[0];
  }

  const updatedPayload = {
    ...payload,
  };

  const result = await PatientModel.update({ PK: `PATIENT#${id}` }, updatedPayload);

  result.PK = undefined;

  return result;
}

async function deleteById(id) {
  await PatientModel.delete({ PK: `PATIENT#${id}` });

  return { message: "Patient deleted successfully" };
}

export default {
  findAll,
  findOneById,
  update,
  deleteById,
};
