import dynamoose from 'dynamoose';

export const PatientDynamoSchema = new dynamoose.Schema(
  {
    PK: {
        type: String,
        hashKey: true,
    },
    id: String,
    taxId: String,
    healthServiceNumber: String,
    birthDate: Date,
    name: String,
    weight: Number,
    height: Number,
    bloodType: String,  
    address: {
      type: Object,
      schema: {
        street: String, 
        city: String,
        state: String,
        country: String,
        postalCode: String, 
      },
    },
    phoneNumber: String,
  }, 
  {
    timestamps: true,
  }
);
