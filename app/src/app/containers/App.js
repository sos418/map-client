import { connect } from 'react-redux';
import App from '../components/App';

const mapStateToProps = state => ({
  welcomeModalUrl: state.welcomeModal.url,
  banner: state.literals.banner
});

export default connect(mapStateToProps)(App);
