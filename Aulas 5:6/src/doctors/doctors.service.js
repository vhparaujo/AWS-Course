import dynamoose from "dynamoose";
import { DoctorDynamoSchema } from "./doctors.schema.js";
import crypto from "node:crypto";
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

const DoctorModel = dynamoose.model("Doctor", DoctorDynamoSchema, {
  create: false,
  waitForActive: false,
});

async function createDoctor(payload) {
  payload.id = crypto.randomUUID();

  payload.PK = `DOCTOR#${payload.id}`;

  const result = await DoctorModel.create(payload);

  result.PK = undefined;

  return result;
}

async function findOneById(id) {
  const result = await DoctorModel.get({ PK: `DOCTOR#${id}` });

  if (result) {
    result.PK = undefined;
  }

  return result;
}

async function findAll() {
  const result = await DoctorModel.scan().exec();

  return result.map((item) => {
    item.PK = undefined;
    return item;
  });
}

async function update(id, payload) {
  const doctor = await DoctorModel.get({ PK: `DOCTOR#${id}` });

  if (!doctor) {
    return null;
  }

  const updatedPayload = {
    ...payload,
  };

  const result = await DoctorModel.update(
    { PK: `DOCTOR#${id}` },
    updatedPayload
  );

  result.PK = undefined;

  return result;
}

async function deleteById(id) {
  await DoctorModel.delete({ PK: `DOCTOR#${id}` });

  return { message: "Doctor deleted successfully" };
}

// async function notifyPatientCreated(patient) {
//   const client = new EventBridgeClient({});

//   await client.send(
//     new PutEventsCommand({
//       Entries: [
//         {
//           Source: "aula5-clinica",
//           DetailType: "PatientCreated",
//           Detail: JSON.stringify({ patient }),
//         },
//       ],
//     })
//   );
// }

export default {
  createDoctor,
  findAll,
  findOneById,
  update,
  deleteById,
};
