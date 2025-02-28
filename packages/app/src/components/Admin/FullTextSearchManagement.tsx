import React, { FC } from 'react';

import { useTranslation } from 'react-i18next';

import ElasticsearchManagement from './ElasticsearchManagement/ElasticsearchManagement';

type Props = {

};

const FullTextSearchManagement: FC<Props> = () => {
  const { t } = useTranslation();

  return (
    <div data-testid="admin-full-text-search">
      <h2> { t('full_text_search_management.elasticsearch_management') } </h2>
      <ElasticsearchManagement />
    </div>
  );
};

export default FullTextSearchManagement;
