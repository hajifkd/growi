import React from 'react';
import PropTypes from 'prop-types';

import urljoin from 'url-join';

import LinkedPagePath from '../models/linked-page-path';


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const PagePathHierarchicalLink = (props) => {
  const {
    linkedPagePath, linkedPagePathByHtml, basePath, isInTrash,
  } = props;
  // render root element
  if (linkedPagePath.isRoot) {
    if (basePath != null) {
      return null;
    }

    return isInTrash
      ? (
        <>
          <span className="path-segment">
            <a href="/trash"><i className="icon-trash"></i></a>
          </span>
          <span className="separator"><a href="/">/</a></span>
        </>
      )
      : (
        <>
          <span className="path-segment">
            <a href="/">
              <i className="icon-home"></i>
              <span className="separator">/</span>
            </a>
          </span>
        </>
      );
  }

  const isParentExists = linkedPagePath.parent != null;
  const isParentRoot = linkedPagePath.parent?.isRoot;
  const isSeparatorRequired = isParentExists && !isParentRoot;

  const shouldDangerouslySetInnerHTML = linkedPagePathByHtml != null;

  const href = encodeURI(urljoin(basePath || '/', linkedPagePath.href));

  // eslint-disable-next-line react/prop-types
  const RootElm = ({ children }) => {
    return props.isInnerElem
      ? <>{children}</>
      : <span className="grw-page-path-hierarchical-link text-break">{children}</span>;
  };

  return (
    <RootElm>
      { isParentExists && (
        <PagePathHierarchicalLink
          linkedPagePath={linkedPagePath.parent}
          linkedPagePathByHtml={linkedPagePathByHtml?.parent}
          basePath={basePath}
          isInTrash={isInTrash || linkedPagePath.isInTrash}
          isInnerElem
        />
      ) }
      { isSeparatorRequired && (
        <span className="separator">/</span>
      ) }

      {
        shouldDangerouslySetInnerHTML
          // eslint-disable-next-line react/no-danger
          ? <a className="page-segment" href={href} dangerouslySetInnerHTML={{ __html: linkedPagePathByHtml.pathName }}></a>
          : <a className="page-segment" href={href}>{linkedPagePath.pathName}</a>
      }

    </RootElm>
  );
};

PagePathHierarchicalLink.propTypes = {
  linkedPagePath: PropTypes.instanceOf(LinkedPagePath).isRequired,
  linkedPagePathByHtml: PropTypes.instanceOf(LinkedPagePath), // Not required
  basePath: PropTypes.string,
  isInTrash: PropTypes.bool,

  // !!INTERNAL USE ONLY!!
  isInnerElem: PropTypes.bool,
};

export default PagePathHierarchicalLink;
