import ReactGA from 'react-ga';
import { loadLiterals } from 'siteNav/literalsActions';
import { setToken, getLoggedUser } from 'user/userActions';
import { setWelcomeModalUrl, setWelcomeModalContent } from 'welcomeModal/welcomeModalActions';

const ACCESS_TOKEN_REGEX = /#access_token=([a-zA-Z0-9.\-_]*)(&[a-z=])?/g;

export function init() {
  return (dispatch, getState) => {
    ReactGA.initialize(GA_TRACKING_CODE);
    ReactGA.pageview(window.location.pathname);

    ACCESS_TOKEN_REGEX.lastIndex = 0;
    if (ACCESS_TOKEN_REGEX.test(window.location.hash)) {
      ACCESS_TOKEN_REGEX.lastIndex = 0;
      const parts = ACCESS_TOKEN_REGEX.exec(window.location.hash);
      if (parts && parts.length >= 2) {
        dispatch(setToken(parts[1]));
      }
    }



    dispatch(getLoggedUser());

    if (!DISABLE_WELCOME_MODAL) {
      dispatch(setWelcomeModalUrl());
      const welcomeModalUrl = getState().welcomeModal.url;
      const storedUrl = localStorage.getItem(WELCOME_MODAL_COOKIE_KEY);
      if (welcomeModalUrl && storedUrl !== welcomeModalUrl) {
        localStorage.setItem(WELCOME_MODAL_COOKIE_KEY, welcomeModalUrl);
        dispatch(setWelcomeModalContent());
      }
    }

    dispatch(loadLiterals());
  };
}
