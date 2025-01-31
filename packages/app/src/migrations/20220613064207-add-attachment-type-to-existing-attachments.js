import { getModelSafely, getMongoUri, mongoOptions } from '@growi/core';
import mongoose from 'mongoose';

import { AttachmentType } from '~/server/interfaces/attachment';
import attachmentModel from '~/server/models/attachment';
import loggerFactory from '~/utils/logger';

const logger = loggerFactory('growi:migrate:add-attachment-type-to-existing-attachments');

module.exports = {
  async up(db) {
    logger.info('Apply migration');
    mongoose.connect(getMongoUri(), mongoOptions);
    const Attachment = getModelSafely('Attachment') || attachmentModel();

    // Add attachmentType for wiki page
    // Filter pages where "attachmentType" doesn't exist and "page" is not null
    const operationsForWikiPage = {
      updateMany:
         {
           filter: { page: { $ne: null }, attachmentType: { $exists: false } },
           update: { $set: { attachmentType: AttachmentType.WIKI_PAGE } },
         },
    };

    // Add attachmentType for profile image
    // Filter pages where "attachmentType" doesn't exist and "page" is null
    const operationsForProfileImage = {
      updateMany:
        {
          filter: { page: { $eq: null }, attachmentType: { $exists: false } },
          update: { $set: { attachmentType: AttachmentType.PROFILE_IMAGE } },
        },
    };
    await Attachment.bulkWrite([operationsForWikiPage, operationsForProfileImage]);

    logger.info('Migration has successfully applied');

  },

  async down(db) {
    // No rollback
  },
};
