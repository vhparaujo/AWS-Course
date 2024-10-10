import dynamoose from "dynamoose";

export const DoctorDynamoSchema = new dynamoose.Schema(
  {
    PK: {
      type: String,
      hashKey: true, // Chave primária
    },
    id: String,
    crm: {
      // Número de CRM (National Health Service Medical Number)
      type: String,
      required: true,
    },
    name: {
      // Nome do médico
      type: String,
      required: true,
    },
    specialty: String,
    phoneNumber: String,
    address: {
      // Endereço
      type: Object,
      schema: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
      },
    },
  },
  {
    timestamps: true, // Adiciona campos de criação e atualização automaticamente
  }
);
