const { getUser, addUser } = require("./user-service");

async function handler(event) {
  const { method } = event.requestContext.http;

  if (method === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify(getUser()),
    };
  }

  if (method === "POST") {
    const user = JSON.parse(event.body);
    addUser(user);
    return {
      statusCode: 201,
      body: JSON.stringify(user ),
    };
  };

  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Method not allowed" }),      
  };
}

exports.handler = handler;
