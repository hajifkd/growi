import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Card, CardBody } from 'reactstrap';

import AdminCustomizeContainer from '~/client/services/AdminCustomizeContainer';
import { toastSuccess, toastError } from '~/client/util/apiNotification';

import { withUnstatedContainers } from '../../UnstatedUtils';
import AdminUpdateButtonRow from '../Common/AdminUpdateButtonRow';
import CustomHeaderEditor from '../CustomHeaderEditor';

type Props = {
  adminCustomizeContainer: AdminCustomizeContainer
}

const CustomizeHeaderSetting = (props: Props): JSX.Element => {

  const { adminCustomizeContainer } = props;
  const { t } = useTranslation();

  const onClickSubmit = useCallback(async() => {
    try {
      await adminCustomizeContainer.updateCustomizeHeader();
      toastSuccess(t('toaster.update_successed', { target: t('admin:customize_setting.custom_header') }));
    }
    catch (err) {
      toastError(err);
    }
  }, [t, adminCustomizeContainer]);

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <h2 className="admin-setting-header">{t('admin:customize_setting.custom_header')}</h2>

          <Card className="card well my-3">
            <CardBody className="px-0 py-2">
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: t('admin:customize_setting.custom_header_detail') }}
              />
            </CardBody>
          </Card>
          <div className="form-text text-muted">
            { t('Example') }:
            <pre className="hljs">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <code className="text-wrap">&lt;script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.13.0/build/languages/yaml.min.js"
                defer&gt;&lt;/script&gt;
              </code>
            </pre>
          </div>

          <div className="form-group">
            <CustomHeaderEditor
              value={adminCustomizeContainer.state.currentCustomizeHeader || ''}
              onChange={(inputValue) => { adminCustomizeContainer.changeCustomizeHeader(inputValue) }}
            />
            <p className="form-text text-muted text-right">
              <i className="fa fa-fw fa-keyboard-o" aria-hidden="true"></i>
              {t('admin:customize_setting.ctrl_space')}
            </p>
          </div>
          <AdminUpdateButtonRow onClick={onClickSubmit} disabled={adminCustomizeContainer.state.retrieveError != null} />
        </div>
      </div>
    </React.Fragment>
  );

};

const CustomizeHeaderSettingWrapper = withUnstatedContainers(CustomizeHeaderSetting, [AdminCustomizeContainer]);

export default CustomizeHeaderSettingWrapper;
