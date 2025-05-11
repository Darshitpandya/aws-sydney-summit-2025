/**
 * Notification Lambda Function
 * 
 * This function sends notifications via SNS based on the workflow results.
 */

const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async (event) => {
  console.log("Notification handler triggered", JSON.stringify(event, null, 2));
  
  try {
    // Extract data from the event
    const processedData = event.processedData || {};
    const rawEvent = event.rawEvent || {};
    const environment = process.env.ENVIRONMENT || 'unknown';
    
    // Determine notification type and content based on the event
    let subject, message;
    
    if (processedData.serviceName && processedData.deploymentStatus) {
      // Proton service deployment notification
      const status = processedData.deploymentStatus;
      const serviceName = processedData.serviceName;
      
      subject = `[${environment.toUpperCase()}] Proton Service ${serviceName} - ${status}`;
      
      message = {
        title: `Service Deployment ${status}`,
        service: serviceName,
        status: status,
        template: processedData.templateName,
        version: processedData.templateVersion,
        timestamp: processedData.timestamp,
        environment: environment
      };
    } else {
      // Generic notification
      subject = `[${environment.toUpperCase()}] Platform Event Notification`;
      
      message = {
        title: "Platform Event Processed",
        eventType: processedData.eventType || rawEvent['detail-type'] || 'Unknown',
        source: processedData.eventSource || rawEvent.source || 'Unknown',
        timestamp: new Date().toISOString(),
        details: processedData,
        environment: environment
      };
    }
    
    // Send notification via SNS
    const params = {
      TopicArn: process.env.NOTIFICATION_TOPIC_ARN,
      Subject: subject,
      Message: JSON.stringify(message, null, 2)
    };
    
    console.log("Sending SNS notification:", params);
    await sns.publish(params).promise();
    
    console.log("Notification sent successfully");
    return {
      statusCode: 200,
      body: "Notification sent successfully",
      notificationDetails: {
        subject,
        topicArn: process.env.NOTIFICATION_TOPIC_ARN,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};