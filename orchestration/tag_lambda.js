const AWS = require('aws-sdk');
const tagging = new AWS.ResourceGroupsTaggingAPI();

exports.handler = async (event) => {
  console.log("Event received:", JSON.stringify(event, null, 2));

  const service = event.detail.service.name;
  const environment = event.detail.environment.name;
  const resourceArn = process.env.TARGET_ARN;

  const tags = {
    "Platform": "Proton",
    "Service": service,
    "Environment": environment
  };

  try {
    await tagging.tagResources({
      ResourceARNList: [resourceArn],
      Tags: tags
    }).promise();
    return { status: "Tags applied", tags };
  } catch (err) {
    console.error("Error tagging resources:", err);
    throw err;
  }
};
