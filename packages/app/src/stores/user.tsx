import useSWR, { SWRResponse } from 'swr';
import useSWRImmutable from 'swr/immutable';

import { apiv3Get } from '~/client/util/apiv3-client';
import { IUserHasId } from '~/interfaces/user';
import { checkAndUpdateImageUrlCached } from '~/stores/middlewares/user';

export const useSWRxUsersList = (userIds: string[]): SWRResponse<IUserHasId[], Error> => {
  const distinctUserIds = userIds.length > 0 ? Array.from(new Set(userIds)).sort() : [];
  return useSWR(
    distinctUserIds.length > 0 ? ['/users/list', distinctUserIds] : null,
    (endpoint, userIds) => apiv3Get(endpoint, { userIds: userIds.join(',') }).then((response) => {
      return response.data.users;
    }),
    { use: [checkAndUpdateImageUrlCached] },
  );
};

type usernameRequertOptions = {
  isIncludeActiveUsernames?: boolean,
  isIncludeInactiveUsernames?: boolean,
  isIncludeActivitySnapshotUsernames?: boolean,
  isIncludeMixedUsernames?: boolean,
}

type userData = {
  usernames: string[]
  totalCount: number
}

type usernameResponse = {
  activeUser?: userData
  inactiveUser?: userData
  activitySnapshotUser?: userData
  mixedUsernames: string[]
}

export const useSWRxUsernames = (q: string, offset?: number, limit?: number, options?: usernameRequertOptions): SWRResponse<usernameResponse, Error> => {
  return useSWRImmutable(
    q != null ? ['/users/usernames', q, offset, limit, options] : null,
    (endpoint, q, offset, limit, options) => apiv3Get(endpoint, {
      q, offset, limit, options: JSON.stringify(options),
    }).then(result => result.data),
  );
};
