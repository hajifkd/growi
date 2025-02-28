import { pathUtils } from '@growi/core';
import { Container } from 'unstated';
import urljoin from 'url-join';

import loggerFactory from '~/utils/logger';
import { removeNullPropertyFromObject } from '~/utils/object-utils';

import { apiv3Get, apiv3Put } from '../util/apiv3-client';

const logger = loggerFactory('growi:security:AdminTwitterSecurityContainer');

/**
 * Service container for admin security page (TwitterSecurityManagement.jsx)
 * @extends {Container} unstated Container
 */
export default class AdminTwitterSecurityContainer extends Container {

  constructor(appContainer) {
    super();

    this.appContainer = appContainer;
    this.dummyTwitterConsumerKey = 0;
    this.dummyTwitterConsumerKeyForError = 1;

    this.state = {
      callbackUrl: urljoin(pathUtils.removeTrailingSlash(appContainer.config.crowi.url), '/passport/twitter/callback'),
      // set dummy value tile for using suspense
      twitterConsumerKey: this.dummyTwitterConsumerKey,
      twitterConsumerSecret: '',
      isSameUsernameTreatedAsIdenticalUser: false,
    };

    this.updateTwitterSetting = this.updateTwitterSetting.bind(this);
  }

  /**
   * retrieve security data
   */
  async retrieveSecurityData() {
    try {
      const response = await apiv3Get('/security-setting/');
      const { twitterOAuth } = response.data.securityParams;
      this.setState({
        twitterConsumerKey: twitterOAuth.twitterConsumerKey,
        twitterConsumerSecret: twitterOAuth.twitterConsumerSecret,
        isSameUsernameTreatedAsIdenticalUser: twitterOAuth.isSameUsernameTreatedAsIdenticalUser,
      });
    }
    catch (err) {
      this.setState({ retrieveError: err });
      logger.error(err);
      throw new Error('Failed to fetch data');
    }
  }

  /**
   * Workaround for the mangling in production build to break constructor.name
   */
  static getClassName() {
    return 'AdminTwitterSecurityContainer';
  }

  /**
   * Change twitterConsumerKey
   */
  changeTwitterConsumerKey(value) {
    this.setState({ twitterConsumerKey: value });
  }

  /**
   * Change twitterConsumerSecret
   */
  changeTwitterConsumerSecret(value) {
    this.setState({ twitterConsumerSecret: value });
  }

  /**
   * Switch isSameUsernameTreatedAsIdenticalUser
   */
  switchIsSameUsernameTreatedAsIdenticalUser() {
    this.setState({ isSameUsernameTreatedAsIdenticalUser: !this.state.isSameUsernameTreatedAsIdenticalUser });
  }

  /**
   * Update twitterSetting
   */
  async updateTwitterSetting() {
    const { twitterConsumerKey, twitterConsumerSecret, isSameUsernameTreatedAsIdenticalUser } = this.state;

    let requestParams = { twitterConsumerKey, twitterConsumerSecret, isSameUsernameTreatedAsIdenticalUser };

    requestParams = await removeNullPropertyFromObject(requestParams);
    const response = await apiv3Put('/security-setting/twitter-oauth', requestParams);
    const { securitySettingParams } = response.data;

    this.setState({
      twitterConsumerKey: securitySettingParams.twitterConsumerKey,
      twitterConsumerSecret: securitySettingParams.twitterConsumerSecret,
      isSameUsernameTreatedAsIdenticalUser: securitySettingParams.isSameUsernameTreatedAsIdenticalUser,
    });
    return response;
  }

}
