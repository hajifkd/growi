import React, { useState, useEffect, useCallback } from 'react';
// import PropTypes from 'prop-types';
import loggerFactory from '@alias/logger';

import StickyEvents from 'sticky-events';

import GrowiSubNavigation from './GrowiSubNavigation';

const logger = loggerFactory('growi:cli:GrowiSubNavigationSticky');


const GrowiSubNavigationFixed = (props) => {

  const [isVisible, setVisible] = useState(false);

  const stickyChangeHandler = useCallback((event) => {
    logger.debug('StickyEvents.CHANGE detected');
    setVisible(event.detail.isSticky);
  }, []);

  // setup effect by sticky event
  useEffect(() => {
    // sticky
    // See: https://github.com/ryanwalters/sticky-events
    const stickyEvents = new StickyEvents({ stickySelector: '#grw-subnav-sticky-trigger' });
    const { stickySelector } = stickyEvents;
    const elem = document.querySelector(stickySelector);
    elem.addEventListener(StickyEvents.CHANGE, stickyChangeHandler);

    // return clean up handler
    return () => {
      elem.removeEventListener(StickyEvents.CHANGE, stickyChangeHandler);
    };
  }, []);

  return (
    <div className={`${isVisible ? '' : 'd-none'}`}>
      <GrowiSubNavigation isCompactMode />
    </div>
  );
};

GrowiSubNavigationFixed.propTypes = {
};

export default GrowiSubNavigationFixed;
