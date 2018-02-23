/* global PIXI */
/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import AppStyles from 'styles/components/app.scss';
import BannerStyles from 'styles/components/banner.scss';
import { getURLParameterByName } from 'lib/getURLParameterByName';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bannerDismissed: false
    };
  }

  dismissBanner() {
    this.setState({
      bannerDismissed: true
    });
  }

  render() {
    const isWebGLSupported = PIXI.utils.isWebGLSupported();
    const showBanner =
      (isWebGLSupported === false || (SHOW_BANNER === true && this.props.banner !== undefined))
      && this.state.bannerDismissed === false
      && window.innerWidth > 768
      && getURLParameterByName('embedded') !== 'true';
    const bannerContent = (SHOW_BANNER === true) ? (<span
      dangerouslySetInnerHTML={{ __html: this.props.banner }}
    />) : (<span>
      ⚠️ There is a problem with your current configuration (WebGL is disabled or unavailable).
      The map will be shown with degraded performance.
    </span>);

    document.body.classList.toggle('-has-banner', showBanner);

    return (
      <div>
        {showBanner === true &&
          <div className={BannerStyles.banner}>
            {bannerContent}
            <button className={BannerStyles.closeButton} onClick={() => this.dismissBanner()}>
              <span className={BannerStyles.icon}>✕</span>
            </button>
          </div>
        }
        <div className={classnames('fullHeightContainer', AppStyles.app)}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object,
  welcomeModalUrl: PropTypes.string,
  banner: PropTypes.string
};


export default App;
