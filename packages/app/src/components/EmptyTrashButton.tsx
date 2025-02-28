import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { toastSuccess } from '~/client/util/apiNotification';
import {
  IDataWithMeta,
  IPageHasId,
  IPageInfo,
} from '~/interfaces/page';
import { useEmptyTrashModal } from '~/stores/modal';
import { useSWRxDescendantsPageListForCurrrentPath, useSWRxPageInfoForList } from '~/stores/page';


const EmptyTrashButton = () => {
  const { t } = useTranslation();
  const { open: openEmptyTrashModal } = useEmptyTrashModal();
  const { data: pagingResult, mutate } = useSWRxDescendantsPageListForCurrrentPath();

  const pageIds = pagingResult?.items?.map(page => page._id);
  const { injectTo } = useSWRxPageInfoForList(pageIds, true, true);

  let pageWithMetas: IDataWithMeta<IPageHasId, IPageInfo>[] = [];

  const convertToIDataWithMeta = (page) => {
    return { data: page };
  };

  if (pagingResult != null) {
    const dataWithMetas = pagingResult.items.map(page => convertToIDataWithMeta(page));
    pageWithMetas = injectTo(dataWithMetas);
  }

  const deletablePages = pageWithMetas.filter(page => page.meta?.isAbleToDeleteCompletely);

  const onEmptiedTrashHandler = useCallback(() => {
    toastSuccess(t('empty_trash'));

    mutate();
  }, [t, mutate]);

  const emptyTrashClickHandler = () => {
    if (deletablePages.length === 0) { return }
    openEmptyTrashModal(deletablePages, { onEmptiedTrash: onEmptiedTrashHandler, canDelepeAllPages: pagingResult?.totalCount === deletablePages.length });
  };

  return (
    <div className="d-flex align-items-center">
      <button
        type="button"
        className="btn btn-outline-secondary rounded-pill text-danger d-flex align-items-center"
        onClick={() => emptyTrashClickHandler()}
      >
        <i className="icon-fw icon-trash"></i>
        <div>{t('modal_empty.empty_the_trash')}</div>
      </button>
    </div>
  );
};

export default EmptyTrashButton;
