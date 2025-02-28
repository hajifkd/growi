import React, {
  FC, useState, useEffect, useCallback,
} from 'react';

import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import AppContainer from '~/client/services/AppContainer';
import { withUnstatedContainers } from '../UnstatedUtils';
import InAppNotificationList from './InAppNotificationList';
import { useSWRxInAppNotifications, useSWRxInAppNotificationStatus } from '../../stores/in-app-notification';
import PaginationWrapper from '../PaginationWrapper';
import CustomNavAndContents from '../CustomNavigation/CustomNavAndContents';
import { InAppNotificationStatuses } from '~/interfaces/in-app-notification';
import { apiv3Put, apiv3Post } from '~/client/util/apiv3-client';

import loggerFactory from '~/utils/logger';

const logger = loggerFactory('growi:InAppNotificationPage');


type Props = {
  appContainer: AppContainer
}

const InAppNotificationPageBody: FC<Props> = (props) => {
  const { appContainer } = props;
  const limit = appContainer.config.pageLimitationXL;
  const { t } = useTranslation();
  const { mutate } = useSWRxInAppNotificationStatus();

  const updateNotificationStatus = useCallback(async() => {
    try {
      await apiv3Post('/in-app-notification/read');
      mutate();
    }
    catch (err) {
      logger.error(err);
    }
  }, [mutate]);

  useEffect(() => {
    updateNotificationStatus();
  }, [updateNotificationStatus]);

  const InAppNotificationCategoryByStatus = (status?: InAppNotificationStatuses) => {
    const [activePage, setActivePage] = useState(1);
    const offset = (activePage - 1) * limit;

    let categoryStatus;

    switch (status) {
      case InAppNotificationStatuses.STATUS_UNOPENED:
        categoryStatus = InAppNotificationStatuses.STATUS_UNOPENED;
        break;
      default:
    }

    const { data: notificationData, mutate: mutateNotificationData } = useSWRxInAppNotifications(limit, offset, categoryStatus);
    const { mutate: mutateAllNotificationData } = useSWRxInAppNotifications(limit, offset, undefined);

    const setAllNotificationPageNumber = (selectedPageNumber): void => {
      setActivePage(selectedPageNumber);
    };


    if (notificationData == null) {
      return (
        <div className="wiki">
          <div className="text-muted text-center">
            <i className="fa fa-2x fa-spinner fa-pulse mr-1"></i>
          </div>
        </div>
      );
    }

    const updateUnopendNotificationStatusesToOpened = async() => {
      await apiv3Put('/in-app-notification/all-statuses-open');
      // mutate notification statuses in 'UNREAD' Category
      mutateNotificationData();
      // mutate notification statuses in 'ALL' Category
      mutateAllNotificationData();
    };


    return (
      <>
        {(status === InAppNotificationStatuses.STATUS_UNOPENED && notificationData.totalDocs > 0)
      && (
        <div className="mb-2 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={updateUnopendNotificationStatusesToOpened}
          >
            {t('in_app_notification.mark_all_as_read')}
          </button>
        </div>
      )}
        { notificationData != null && notificationData.docs.length === 0
          // no items
          ? t('in_app_notification.mark_all_as_read')
          // render list-group
          : (
            <div className="list-group">
              <InAppNotificationList inAppNotificationData={notificationData} type="button" elemClassName="list-group-item list-group-item-action" />
            </div>
          )
        }

        {notificationData.totalDocs > 0 && (
          <div className="mt-4">
            <PaginationWrapper
              activePage={activePage}
              changePage={setAllNotificationPageNumber}
              totalItemsCount={notificationData.totalDocs}
              pagingLimit={notificationData.limit}
              align="center"
              size="sm"
            />
          </div>
        ) }
      </>
    );
  };

  const navTabMapping = {
    user_infomation: {
      Icon: () => <></>,
      Content: () => InAppNotificationCategoryByStatus(),
      i18n: t('in_app_notification.all'),
      index: 0,
    },
    external_accounts: {
      Icon: () => <></>,
      Content: () => InAppNotificationCategoryByStatus(InAppNotificationStatuses.STATUS_UNOPENED),
      i18n: t('in_app_notification.unopend'),
      index: 1,
    },
  };

  return (
    <CustomNavAndContents navTabMapping={navTabMapping} tabContentClasses={['mt-4']} />
  );
};

const InAppNotificationPage = withUnstatedContainers(InAppNotificationPageBody, [AppContainer]);
export default InAppNotificationPage;

InAppNotificationPageBody.propTypes = {
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
};
