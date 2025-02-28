import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import CustomNavAndContents from './CustomNavigation/CustomNavAndContents';
import { DescendantsPageListForCurrentPath } from './DescendantsPageList';
import EmptyTrashButton from './EmptyTrashButton';
import PageListIcon from './Icons/PageListIcon';


const TrashPageList = () => {
  const { t } = useTranslation();

  const navTabMapping = useMemo(() => {
    return {
      pagelist: {
        Icon: PageListIcon,
        Content: DescendantsPageListForCurrentPath,
        i18n: t('page_list'),
        index: 0,
      },
    };
  }, [t]);

  const emptyTrashButton = useMemo(() => {
    return <EmptyTrashButton />;
  }, []);

  return (
    <div data-testid="trash-page-list" className="mt-5 d-edit-none">
      <CustomNavAndContents navTabMapping={navTabMapping} navRightElement={emptyTrashButton} />
    </div>
  );
};

export default TrashPageList;
