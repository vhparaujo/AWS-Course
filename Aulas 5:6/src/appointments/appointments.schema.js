import dynamoose from "dynamoose";

export const AppointmentDynamoSchema = new dynamoose.Schema(
  {
    PK: {
      type: String,
      hashKey: true, // Chave primária composta por 'APPOINTMENT#' + appointmentId
    },
    appointmentId: String, // ID único da consulta
    date: {
      type: Date, // Data da consulta (em formato ISO ou outro desejado)
      required: true,
    },
    doctorId: {
      type: String, // ID do médico (CRM)
      required: true,
    },
    patientId: {
      type: String, // ID ou nome do paciente
      required: true,
    },
    observations: String, // Observações adicionais da consulta
  },
  {
    timestamps: true, // Adiciona campos de criação e atualização automaticamente
  }
);
