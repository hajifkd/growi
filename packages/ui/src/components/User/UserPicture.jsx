import React from 'react';

import { pagePathUtils } from '@growi/core';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';


const { userPageRoot } = pagePathUtils;


const DEFAULT_IMAGE = '/images/icons/user.svg';

export class UserPicture extends React.Component {

  getClassName() {
    const className = ['rounded-circle', 'picture'];
    // size
    if (this.props.size) {
      className.push(`picture-${this.props.size}`);
    }

    return className.join(' ');
  }

  renderForNull() {
    return (
      <img
        src={DEFAULT_IMAGE}
        alt="someone"
        className={this.getClassName()}
      />
    );
  }

  RootElmWithoutLink = (props) => {
    return <span {...props}>{props.children}</span>;
  }

  RootElmWithLink = (props) => {
    const { user } = this.props;
    const href = userPageRoot(user);
    // Using <span> tag here instead of <a> tag because UserPicture is used in SearchResultList which is essentially a anchor tag.
    // Nested anchor tags causes a warning.
    // https://stackoverflow.com/questions/13052598/creating-anchor-tag-inside-anchor-taga
    return <span onClick={() => { window.location.href = href }} {...props}>{props.children}</span>;
  }

  withTooltip = (RootElm) => {
    const { user } = this.props;
    const id = `user-picture-${Math.random().toString(32).substring(2)}`;

    return props => (
      <>
        <RootElm id={id}>{props.children}</RootElm>
        <UncontrolledTooltip placement="bottom" target={id} delay={0} fade={false}>
          @{user.username}<br />
          {user.name}
        </UncontrolledTooltip>
      </>
    );
  }

  render() {
    const user = this.props.user;

    if (user == null) {
      return this.renderForNull();
    }

    const { noLink, noTooltip } = this.props;

    // determine RootElm
    let RootElm = noLink ? this.RootElmWithoutLink : this.RootElmWithLink;
    if (!noTooltip) {
      RootElm = this.withTooltip(RootElm);
    }

    const userPictureSrc = user.imageUrlCached || DEFAULT_IMAGE;

    return (
      <RootElm>
        <img
          src={userPictureSrc}
          alt={user.username}
          className={this.getClassName()}
        />
      </RootElm>
    );
  }

}

UserPicture.propTypes = {
  user: PropTypes.object,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  noLink: PropTypes.bool,
  noTooltip: PropTypes.bool,
};

UserPicture.defaultProps = {
  size: null,
  noLink: false,
  noTooltip: false,
};
