import React from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import AdminUsersContainer from '~/client/services/AdminUsersContainer';
import AppContainer from '~/client/services/AppContainer';
import { toastSuccess, toastError } from '~/client/util/apiNotification';
import { apiv3Put } from '~/client/util/apiv3-client';

import { withUnstatedContainers } from '../../UnstatedUtils';

const SendInvitationEmailButton = (props) => {
  const {
    appContainer, user, isInvitationEmailSended, onSuccessfullySentInvitationEmail,
  } = props;
  const { t } = useTranslation();

  const textColor = !isInvitationEmailSended ? 'text-danger' : '';

  const onClickSendInvitationEmailButton = async() => {
    try {
      const res = await apiv3Put('/users/send-invitation-email', { id: user._id });
      const { failedToSendEmail } = res.data;
      if (failedToSendEmail == null) {
        const msg = `Email has been sent<br>・${user.email}`;
        toastSuccess(msg);
        onSuccessfullySentInvitationEmail();
      }
      else {
        const msg = { message: `email: ${failedToSendEmail.email}<br>reason: ${failedToSendEmail.reason}` };
        toastError(msg);
      }
    }
    catch (err) {
      toastError(err);
    }
  };

  return (
    <button className={`dropdown-item ${textColor}`} type="button" onClick={() => { onClickSendInvitationEmailButton() }}>
      <i className="icon-fw icon-envelope"></i>
      {isInvitationEmailSended && (<>{t('admin:user_management.user_table.resend_invitation_email')}</>)}
      {!isInvitationEmailSended && (<>{t('admin:user_management.user_table.send_invitation_email')}</>)}
    </button>
  );
};

const SendInvitationEmailButtonWrapper = withUnstatedContainers(SendInvitationEmailButton, [AppContainer, AdminUsersContainer]);

SendInvitationEmailButton.propTypes = {
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  user: PropTypes.object.isRequired,
  isInvitationEmailSended: PropTypes.bool.isRequired,
  onSuccessfullySentInvitationEmail: PropTypes.func.isRequired,
};

export default SendInvitationEmailButtonWrapper;
