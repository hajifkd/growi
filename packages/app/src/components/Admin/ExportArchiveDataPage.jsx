import React, { Fragment } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as toastr from 'toastr';


import AdminSocketIoContainer from '~/client/services/AdminSocketIoContainer';
import AppContainer from '~/client/services/AppContainer';
import { apiDelete, apiGet } from '~/client/util/apiv1-client';

import { withUnstatedContainers } from '../UnstatedUtils';
// import { toastSuccess, toastError } from '~/client/util/apiNotification';


import LabeledProgressBar from './Common/LabeledProgressBar';
import ArchiveFilesTable from './ExportArchiveData/ArchiveFilesTable';
import SelectCollectionsModal from './ExportArchiveData/SelectCollectionsModal';


const IGNORED_COLLECTION_NAMES = [
  'sessions', 'rlflx', 'activities',
];

class ExportArchiveDataPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collections: [],
      zipFileStats: [],
      progressList: [],
      isExportModalOpen: false,
      isExporting: false,
      isZipping: false,
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
      apiGet('/v3/mongo/collections', {}),
      apiGet('/v3/export/status', {}),
    ]);
    // TODO: toastSuccess, toastError

    // filter only not ignored collection names
    const filteredCollections = collections.filter((collectionName) => {
      return !IGNORED_COLLECTION_NAMES.includes(collectionName);
    });

    const { zipFileStats, isExporting, progressList } = status;
    this.setState({
      collections: filteredCollections,
      zipFileStats,
      isExporting,
      progressList,
    });

    this.setupWebsocketEventHandler();
  }

  setupWebsocketEventHandler() {
    const socket = this.props.adminSocketIoContainer.getSocket();

    // websocket event
    socket.on('admin:onProgressForExport', ({ currentCount, totalCount, progressList }) => {
      this.setState({
        isExporting: true,
        progressList,
      });
    });

    // websocket event
    socket.on('admin:onStartZippingForExport', () => {
      this.setState({
        isZipping: true,
      });
    });

    // websocket event
    socket.on('admin:onTerminateForExport', ({ addedZipFileStat }) => {
      const zipFileStats = this.state.zipFileStats.concat([addedZipFileStat]);

      this.setState({
        isExporting: false,
        isZipping: false,
        isExported: true,
        zipFileStats,
      });

      // TODO: toastSuccess, toastError
      toastr.success(undefined, `New Archive Data '${addedZipFileStat.fileName}' is added`, {
        closeButton: true,
        progressBar: true,
        newestOnTop: false,
        showDuration: '100',
        hideDuration: '100',
        timeOut: '1200',
        extendedTimeOut: '150',
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
      await apiDelete(`/v3/export/${fileName}`, {});

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
   * event handler invoked when export process was requested successfully
   */
  exportingRequestedHandler() {
  }

  renderProgressBarsForCollections() {
    const cols = this.state.progressList.map((progressData) => {
      const { collectionName, currentCount, totalCount } = progressData;
      return (
        <div className="col-md-6" key={collectionName}>
          <LabeledProgressBar
            header={collectionName}
            currentCount={currentCount}
            totalCount={totalCount}
          />
        </div>
      );
    });

    return <div className="row px-3">{cols}</div>;
  }

  renderProgressBarForZipping() {
    const { isZipping, isExported } = this.state;
    const showZippingBar = isZipping || isExported;

    if (!showZippingBar) {
      return <></>;
    }

    return (
      <div className="row px-3">
        <div className="col-md-12" key="progressBarForZipping">
          <LabeledProgressBar
            header="Zip Files"
            currentCount={1}
            totalCount={1}
            isInProgress={isZipping}
          />
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.props;
    const { isExporting, isExported, progressList } = this.state;

    const showExportingData = (isExported || isExporting) && (progressList != null);

    return (
      <div data-testid="admin-export-archive-data">
        <h2>{t('Export Archive Data')}</h2>

        <button type="button" className="btn btn-outline-secondary" disabled={isExporting} onClick={this.openExportModal}>
          {t('admin:export_management.create_new_archive_data')}
        </button>

        { showExportingData && (
          <div className="mt-5">
            <h3>{t('admin:export_management.exporting_collection_list')}</h3>
            { this.renderProgressBarsForCollections() }
            { this.renderProgressBarForZipping() }
          </div>
        ) }

        <div className="mt-5">
          <h3>{t('admin:export_management.exported_data_list')}</h3>
          <ArchiveFilesTable
            zipFileStats={this.state.zipFileStats}
            onZipFileStatRemove={this.onZipFileStatRemove}
          />
        </div>

        <SelectCollectionsModal
          isOpen={this.state.isExportModalOpen}
          onExportingRequested={this.exportingRequestedHandler}
          onClose={this.closeExportModal}
          collections={this.state.collections}
        />
      </div>
    );
  }

}

ExportArchiveDataPage.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  adminSocketIoContainer: PropTypes.instanceOf(AdminSocketIoContainer).isRequired,
};

const ExportArchiveDataPageWrapperFC = (props) => {
  const { t } = useTranslation();
  return <ExportArchiveDataPage t={t} {...props} />;
};

/**
 * Wrapper component for using unstated
 */
const ExportArchiveDataPageWrapper = withUnstatedContainers(ExportArchiveDataPageWrapperFC, [AppContainer, AdminSocketIoContainer]);

export default ExportArchiveDataPageWrapper;
