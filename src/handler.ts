import { processSubscriberFiles } from './processing/subcriber';

export const bucketFileTrigger = async (event, context) => {
  try {
    if (event && event.Records && Array.isArray(event.Records)) {
      await processSubscriberFiles(event.Records);
    }
    context.succeed('done');
  } catch (error) {
    context.fail(error);
  }
};
