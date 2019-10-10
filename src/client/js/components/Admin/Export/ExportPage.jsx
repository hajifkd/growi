import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import * as toastr from 'toastr';


import { createSubscribedElement } from '../../UnstatedUtils';
import AppContainer from '../../../services/AppContainer';
import WebsocketContainer from '../../../services/WebsocketContainer';
// import { toastSuccess, toastError } from '../../../util/apiNotification';

import ExportZipFormModal from './ExportZipFormModal';
import ZipFileTable from './ZipFileTable';
import ExportingProgressBar from './ExportingProgressBar';

class ExportPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collections: [],
      zipFileStats: [],
      progressList: [],
      isExportModalOpen: false,
      isExporting: false,
      isExported: false,
    };

    this.onZipFileStatAdd = this.onZipFileStatAdd.bind(this);
    this.onZipFileStatRemove = this.onZipFileStatRemove.bind(this);
    this.openExportModal = this.openExportModal.bind(this);
    this.closeExportModal = this.closeExportModal.bind(this);
    this.exportingRequestedHandler = this.exportingRequestedHandler.bind(this);
  }

  async componentWillMount() {
    // TODO:: use apiv3.get
    // eslint-disable-next-line no-unused-vars
    const [{ collections }, { status }] = await Promise.all([
      this.props.appContainer.apiGet('/v3/mongo/collections', {}),
      this.props.appContainer.apiGet('/v3/export/status', {}),
    ]);
    // TODO: toastSuccess, toastError

    const { zipFileStats, isExporting, progressList } = status;
    this.setState({
      collections: ['pages', 'revisions'],
      zipFileStats,
      isExporting,
      progressList,
    }); // FIXME: delete this line and uncomment the line below
    // this.setState({ collections, zipFileStats, isExporting });

    this.setupWebsocketEventHandler();
  }

  setupWebsocketEventHandler() {
    const socket = this.props.websocketContainer.getWebSocket();

    socket.on('admin:onProgressForExport', ({ currentCount, totalCount, progressList }) => {
      const isExporting = currentCount !== totalCount;
      this.setState({ isExporting, progressList });
    });

    socket.on('admin:onTerminateForExport', ({ currentCount, totalCount, progressList }) => {
      this.setState({
        isExporting: false,
        isExported: true,
        progressList,
      });
    });
  }

  onZipFileStatAdd(newStat) {
    this.setState((prevState) => {
      return {
        zipFileStats: [...prevState.zipFileStats, newStat],
      };
    });
  }

  async onZipFileStatRemove(fileName) {
    try {
      await this.props.appContainer.apiDelete(`/v3/export/${fileName}`, {});

      this.setState((prevState) => {
        return {
          zipFileStats: prevState.zipFileStats.filter(stat => stat.fileName !== fileName),
        };
      });

      // TODO: toastSuccess, toastError
      toastr.success(undefined, `Deleted ${fileName}`, {
        closeButton: true,
        progressBar: true,
        newestOnTop: false,
        showDuration: '100',
        hideDuration: '100',
        timeOut: '1200',
        extendedTimeOut: '150',
      });
    }
    catch (err) {
      // TODO: toastSuccess, toastError
      toastr.error(err, 'Error', {
        closeButton: true,
        progressBar: true,
        newestOnTop: false,
        showDuration: '100',
        hideDuration: '100',
        timeOut: '3000',
      });
    }
  }

  openExportModal() {
    this.setState({ isExportModalOpen: true });
  }

  closeExportModal() {
    this.setState({ isExportModalOpen: false });
  }

  /**
   * @params {object} export status data
   */
  exportingRequestedHandler(status) {
    const { zipFileStats, isExporting, progressList } = status;
    this.setState({ zipFileStats, isExporting, progressList });
  }

  renderProgressBars() {
    const cols = this.state.progressList.map((progressData) => {
      const { collectionName, currentCount, totalCount } = progressData;
      return (
        <div className="col-md-6" key={collectionName}>
          <ExportingProgressBar
            collectionName={collectionName}
            currentCount={currentCount}
            totalCount={totalCount}
          />
        </div>
      );
    });

    return <div className="row px-3">{cols}</div>;
  }

  render() {
    const { t } = this.props;

    const showExportingData = (this.state.isExported || this.state.isExporting) && (this.state.progressList != null);

    return (
      <Fragment>
        <div className="alert alert-warning">
          <i className="icon-exclamation"></i> { t('export_management.beta_warning') }
        </div>

        <h2>{t('Export Data')}</h2>

        <button type="button" className="btn btn-default" onClick={this.openExportModal}>{t('export_management.create_new_exported_data')}</button>

        { showExportingData && (
          <div className="mt-5">
            <h3>{t('export_management.exporting_data_list')}</h3>
            { this.renderProgressBars() }
          </div>
        ) }

        <div className="mt-5">
          <h3>{t('export_management.exported_data_list')}</h3>
          <ZipFileTable
            zipFileStats={this.state.zipFileStats}
            onZipFileStatRemove={this.onZipFileStatRemove}
          />
        </div>

        <ExportZipFormModal
          isOpen={this.state.isExportModalOpen}
          onExportingRequested={this.exportingRequestedHandler}
          onClose={this.closeExportModal}
          collections={this.state.collections}
        />
      </Fragment>
    );
  }

}

ExportPage.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  websocketContainer: PropTypes.instanceOf(WebsocketContainer).isRequired,
};

/**
 * Wrapper component for using unstated
 */
const ExportPageFormWrapper = (props) => {
  return createSubscribedElement(ExportPage, props, [AppContainer, WebsocketContainer]);
};

export default withTranslation()(ExportPageFormWrapper);
