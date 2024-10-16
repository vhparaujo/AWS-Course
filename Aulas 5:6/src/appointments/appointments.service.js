import dynamoose from "dynamoose";
import { AppointmentDynamoSchema } from "./appointments.schema.js";
import crypto from "node:crypto";

// Criação do modelo Appointment associado ao schema DynamoDB
const AppointmentModel = dynamoose.model(
  "Appointment",
  AppointmentDynamoSchema,
  {
    create: false,
    waitForActive: false,
  }
);

// Função para criar uma consulta (appointment)
async function createAppointment(payload) {
  // Gera um ID único para a consulta
  payload.appointmentId = crypto.randomUUID();

  // Define a PK e SK para a consulta
  payload.PK = `APPOINTMENT#${payload.appointmentId}`;

  // Converte o campo 'date' para o tipo Date, se necessário
  if (typeof payload.date === "string") {
    payload.date = new Date(payload.date); // Conversão da string para Date
  }

  // Salva a consulta no DynamoDB
  const result = await AppointmentModel.create(payload);

  // Remover PK e SK do resultado para não expor ao cliente
  result.PK = undefined;

  return result;
}

// Função para buscar uma consulta por ID (appointmentId)
async function findOneById(appointmentId) {
  const result = await AppointmentModel.get({
    PK: `APPOINTMENT#${appointmentId}`,
  });

  if (result) {
    // Remover PK e SK do resultado
    result.PK = undefined;
  }

  return result;
}

// Função para buscar todas as consultas (appointments)
async function findAll() {
  const result = await AppointmentModel.scan().exec();

  return result.map((item) => {
    // Remover PK e SK dos resultados
    item.PK = undefined;

    return item;
  });
}

// Função para atualizar uma consulta por ID
async function update(appointmentId, payload) {
  const appointment = await AppointmentModel.get({
    PK: `APPOINTMENT#${appointmentId}`,
  });

  if (!appointment) {
    return null;
  }

  const updatedPayload = {
    ...payload,
  };

  // Converte o campo 'date' para o tipo Date, se necessário
  if (typeof updatedPayload.date === "string") {
    updatedPayload.date = new Date(updatedPayload.date); // Conversão da string para Date
  }

  const result = await AppointmentModel.update(
    { PK: `APPOINTMENT#${appointmentId}` },
    updatedPayload
  );

  result.PK = undefined;

  return result;
}

// Função para deletar uma consulta por ID
async function deleteById(appointmentId) {
  await AppointmentModel.delete({ PK: `APPOINTMENT#${appointmentId}` });

  return { message: "Appointment deleted successfully" };
}

export default {
  createAppointment,
  findOneById,
  findAll,
  update,
  deleteById,
};
