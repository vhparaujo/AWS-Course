import dynamoose from 'dynamoose';
import { PatientDynamoSchema } from './patients.schema.js';
import crypto from 'node:crypto'; 

const PatientModel = dynamoose.model('Patient', PatientDynamoSchema, {
    create: false,
});

export async function createPatient(payload) {
    payload.id = crypto.randomUUID();
    payload.PK = `PATIENT#${payload.id}`;

    const result = await PatientModel.create(payload);

    result.PK = undefined;

    return result;
}