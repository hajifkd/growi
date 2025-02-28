import React from 'react';

import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import KeyboardReturnEnterIcon from '~/components/Icons/KeyboardReturnEnterIcon';
import { useShortcutsModal } from '~/stores/modal';

const ShortcutsModal = (): JSX.Element => {
  const { t } = useTranslation();

  const { data: status, close } = useShortcutsModal();

  // add classes to cmd-key by OS
  const platform = window.navigator.platform.toLowerCase();
  const isMac = (platform.indexOf('mac') > -1);
  const additionalClassByOs = isMac ? 'mac' : 'key-longer win';

  return (
    <>
      { status != null && (
        <Modal id="shortcuts-modal" size="lg" isOpen={status.isOpened} toggle={close} className="grw-create-page">
          <ModalHeader tag="h4" toggle={close} className="bg-primary text-light">
            {t('Shortcuts')}
          </ModalHeader>
          <ModalBody>
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <h3>
                    <strong>{t('modal_shortcuts.global.title')}</strong>
                  </h3>

                  <table className="table">
                    <tbody>
                      <tr>
                        <th>
                          {/* eslint-disable-next-line react/no-danger */}
                          <span dangerouslySetInnerHTML={{ __html: t('modal_shortcuts.global.Open/Close shortcut help') }} />:
                        </th>
                        <td>
                          <span className={`key cmd-key ${additionalClassByOs}`}></span> + <span className="key">/</span>
                        </td>
                      </tr>
                      <tr>
                        <th>{t('modal_shortcuts.global.Create Page')}:</th>
                        <td>
                          <span className="key">C</span>
                        </td>
                      </tr>
                      <tr>
                        <th>{t('modal_shortcuts.global.Edit Page')}:</th>
                        <td>
                          <span className="key">E</span>
                        </td>
                      </tr>
                      <tr>
                        <th>{t('modal_shortcuts.global.Search')}:</th>
                        <td><span className="key">/</span></td>
                      </tr>
                      <tr>
                        <th>
                          {/* eslint-disable-next-line react/no-danger */}
                          <span dangerouslySetInnerHTML={{ __html: t('modal_shortcuts.global.Show Contributors') }} />:
                        </th>
                        <td>
                          <a href="{ t('modal_shortcuts.global.konami_code_url') }" target="_blank">
                            {t('modal_shortcuts.global.Konami Code')}
                          </a>
                          <br />
                          <span className="key key-small">&uarr;</span>&nbsp;<span className="key key-small">&uarr;</span>
                          <span className="key key-small">&darr;</span>&nbsp;<span className="key key-small">&darr;</span>
                          <span className="key key-small">&larr;</span>
                          <br />
                          <span className="key key-small">&rarr;</span>
                          <span className="key key-small">&larr;</span>&nbsp;<span className="key key-small">&rarr;</span>
                          <span className="key key-small">B</span>&nbsp;<span className="key key-small">A</span>
                        </td>
                      </tr>
                      <tr>
                        <th>{t('modal_shortcuts.global.MirrorMode')}:</th>
                        <td>
                          <a href="{ t('modal_shortcuts.global.konami_code_url') }" target="_blank">
                            {t('modal_shortcuts.global.Konami Code')}
                          </a>
                          <br />
                          <span className="key key-small">X</span>&nbsp;<span className="key key-small">X</span>
                          <span className="key key-small">B</span>&nbsp;<span className="key key-small">B</span>
                          <span className="key key-small">A</span>
                          <br />
                          <span className="key key-small">Y</span>
                          <span className="key key-small">A</span>&nbsp;<span className="key key-small">Y</span>
                          <span className="key key-small">&darr;</span>&nbsp;<span className="key key-small">&larr;</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="col-lg-6">
                  <h3>
                    <strong>{t('modal_shortcuts.editor.title')}</strong>
                  </h3>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>{t('modal_shortcuts.editor.Indent')}:</th>
                        <td>
                          <span className="key key-longer">Tab</span>
                        </td>
                      </tr>
                      <tr>
                        <th>{t('modal_shortcuts.editor.Outdent')}:</th>
                        <td className="text-nowrap">
                          <span className="key key-long">Shift</span> + <span className="key key-longer">Tab</span>
                        </td>
                      </tr>
                      <tr>
                        <th>{t('modal_shortcuts.editor.Save Page')}:</th>
                        <td>
                          <span className={`key cmd-key ${additionalClassByOs}`}></span> + <span className="key">S</span>
                        </td>
                      </tr>
                      <tr>
                        <th>{t('modal_shortcuts.editor.Delete Line')}:</th>
                        <td>
                          <span className={`key cmd-key ${additionalClassByOs}`}></span> + <span className="key">D</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>
                    <strong>{t('modal_shortcuts.commentform.title')}</strong>
                  </h3>

                  <table className="table">
                    <tbody>
                      <tr>
                        <th>{t('modal_shortcuts.commentform.Post')}:</th>
                        <td className="text-nowrap">
                          <span className={`key cmd-key ${additionalClassByOs}`}></span> +
                          <span className="key key-longer">
                            <KeyboardReturnEnterIcon />
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>{t('modal_shortcuts.editor.Delete Line')}:</th>
                        <td>
                          <span className={`key cmd-key ${additionalClassByOs}`}></span> + <span className="key">D</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>
      ) }
    </>
  );
};

export default ShortcutsModal;
