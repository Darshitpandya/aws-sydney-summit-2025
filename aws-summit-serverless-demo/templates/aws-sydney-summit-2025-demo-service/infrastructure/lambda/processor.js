/**
 * Event Processor Lambda Function
 * 
 * This function processes events from EventBridge and prepares data
 * for the next step in the workflow.
 */

exports.handler = async (event) => {
  console.log("Event processor triggered", JSON.stringify(event, null, 2));
  
  try {
    // Extract relevant information from the event
    const eventSource = event.source || 'unknown';
    const eventType = event['detail-type'] || 'unknown';
    const eventDetail = event.detail || {};
    
    // Process based on event type
    let processedData = {};
    
    if (eventSource === 'aws.proton' && eventType === 'Proton Service Status Change') {
      processedData = {
        serviceName: eventDetail.name,
        status: eventDetail.status,
        deploymentStatus: eventDetail.deploymentStatus,
        templateName: eventDetail.templateName,
        templateVersion: `${eventDetail.templateMajorVersion}.${eventDetail.templateMinorVersion}`,
        timestamp: eventDetail.lastDeploymentSucceededAt || new Date().toISOString()
      };
      
      console.log("Processed Proton service status change:", processedData);
    } else {
      // Handle other event types
      processedData = {
        eventSource,
        eventType,
        timestamp: new Date().toISOString(),
        rawDetail: eventDetail
      };
      
      console.log("Processed generic event:", processedData);
    }
    
    // Add environment information
    processedData.environment = process.env.ENVIRONMENT || 'unknown';
    processedData.region = process.env.AWS_REGION || 'unknown';
    
    // Return the processed data for the next step
    return {
      statusCode: 200,
      processedData,
      rawEvent: event
    };
  } catch (error) {
    console.error("Error processing event:", error);
    throw error;
  }
};