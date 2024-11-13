export const UserSchema = {
  title: "user schema",
  version: 0,
  description: "Schema for user details from API",
  type: "object",
  primaryKey: 'id', // <= the primary key is must
  properties: {
    id: {   type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength 
      },
    firstName: { type: "string" },
    lastName: { type: "string" },
    maidenName: { type: "string" },
    age: { type: "number" },
    gender: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    username: { type: "string" },
    password: { type: "string" },
    birthDate: { type: "string", format: "date" },
    image: { type: "string" },
    bloodGroup: { type: "string" },
    height: { type: "number" },
    weight: { type: "number" },
    eyeColor: { type: "string" },
    hair: {
      type: "object",
      properties: {
        color: { type: "string" },
        type: { type: "string" }
      }
    },
    ip: { type: "string" },
    address: {
      type: "object",
      properties: {
        address: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        stateCode: { type: "string" },
        postalCode: { type: "string" },
        coordinates: {
          type: "object",
          properties: {
            lat: { type: "number" },
            lng: { type: "number" }
          }
        },
        country: { type: "string" }
      }
    },
    macAddress: { type: "string" },
    university: { type: "string" },
    bank: {
      type: "object",
      properties: {
        cardExpire: { type: "string" },
        cardNumber: { type: "string" },
        cardType: { type: "string" },
        currency: { type: "string" },
        iban: { type: "string" }
      }
    },
    company: {
      type: "object",
      properties: {
        department: { type: "string" },
        name: { type: "string" },
        title: { type: "string" },
        address: {
          type: "object",
          properties: {
            address: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            stateCode: { type: "string" },
            postalCode: { type: "string" },
            coordinates: {
              type: "object",
              properties: {
                lat: { type: "number" },
                lng: { type: "number" }
              }
            },
            country: { type: "string" }
          }
        }
      }
    },
    ein: { type: "string" },
    ssn: { type: "string" },
    userAgent: { type: "string" },
    crypto: {
      type: "object",
      properties: {
        coin: { type: "string" },
        wallet: { type: "string" },
        network: { type: "string" }
      }
    },
    role: { type: "string" }
  },
  required: ["id", "firstName", "lastName", "email"] // Campos requeridos
};
