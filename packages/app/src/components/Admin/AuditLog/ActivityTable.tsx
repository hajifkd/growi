import React, { FC } from 'react';

import { pagePathUtils } from '@growi/core';
import { UserPicture } from '@growi/ui';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { IActivityHasId } from '~/interfaces/activity';

type Props = {
  activityList: IActivityHasId[]
}

const formatDate = (date) => {
  return format(new Date(date), 'yyyy/MM/dd HH:mm:ss');
};

export const ActivityTable : FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className="table-responsive text-nowrap h-100">
      <table className="table table-default table-bordered table-user-list">
        <thead>
          <tr>
            <th scope="col">{t('admin:audit_log_management.user')}</th>
            <th scope="col">{t('admin:audit_log_management.date')}</th>
            <th scope="col">{t('admin:audit_log_management.action')}</th>
            <th scope="col">{t('admin:audit_log_management.ip')}</th>
            <th scope="col">{t('admin:audit_log_management.url')}</th>
          </tr>
        </thead>
        <tbody>
          {props.activityList.map((activity) => {
            return (
              <tr data-testid="activity-table" key={activity._id}>
                <td>
                  { activity.user != null && (
                    <>
                      <UserPicture user={activity.user} className="picture rounded-circle" />
                      <a className="ml-2" href={pagePathUtils.userPageRoot(activity.user)}>{activity.snapshot?.username}</a>
                    </>
                  )}
                </td>
                <td>{formatDate(activity.createdAt)}</td>
                <td>{t(`admin:audit_log_action.${activity.action}`)}</td>
                <td>{activity.ip}</td>
                <td>{activity.endpoint}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
