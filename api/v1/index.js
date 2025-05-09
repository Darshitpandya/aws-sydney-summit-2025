exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from AWS Sydney Summit 2025!" })
  };
};
