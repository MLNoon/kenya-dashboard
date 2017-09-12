import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// modules
import { setUser } from 'modules/user';
import { getAgency } from 'modules/agencies';

// Libraries
import isEmpty from 'lodash/isEmpty';

// Components
import { Router, Link } from 'routes';
import Layout from 'components/layout/layout';
import Intro from 'components/ui/intro';

// Constants
import { FAKE_DESCRIPTION } from 'constants/general';


class AgencyPage extends React.PureComponent {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const url = { asPath, pathname, query };
    const { user } = isServer ? req : store.getState();
    if (isServer) store.dispatch(setUser(user));
    await store.dispatch(getAgency(query.id));
    return { user, url, isServer };
  }

  componentWillMount() {
    if (!this.props.isServer && isEmpty(this.props.user)) Router.pushRoute('login');
  }

  render() {
    const { url, info, user } = this.props;

    if (isEmpty(user)) return null;

    return (
      <Layout
        title="Agency"
        description="Agency description..."
        url={url}
        className={user ? 'p-agency -logged' : 'p-about'}
      >
        <div>
          {/* Page intro */}
          <Intro>
            <div className="row">
              <div className="column small-12 medium-10 medium-offset-1">
                <a href={info.url} target="_blank" rel="noopener noreferrer">
                  <h1 className="title -medium">{info.name}</h1>
                </a>
                <p className="description">{info.description && info.description !== '' ?
                  info.description : FAKE_DESCRIPTION}</p>
              </div>
            </div>
          </Intro>

          {/* Agencies list */}
          <section className="c-section indicators-list">
            <div className="row">
              <div className="column small-12 medium-10 medium-offset-1">
                <h1 className="section-title">Contributions to Data</h1>
                <p className="section-description">{FAKE_DESCRIPTION}</p>
              </div>
            </div>
            <div className="row">
              {info.indicators && info.indicators.map((ind, i) => (
                <div key={i} className="column small-12 medium-4 large-3 indicator-container">
                  <Link route={`/compare?indicators=${ind.id}`}>
                    <a>{ind.name}</a>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Contributors */}
          {info.contributors &&
            <section className="c-section contributors-list">
              <div className="row">
                <div className="column small-12 medium-10 medium-offset-1">
                  <h1 className="section-title">Contributors Name</h1>
                </div>
              </div>
              <div className="row">
                <div className="column small-12 medium-4 large-3">
                  <p className="contributors-names">{info.contributors}</p>
                </div>
              </div>
            </section>
          }
        </div>
      </Layout>
    );
  }
}

AgencyPage.propTypes = {
  url: PropTypes.object,
  user: PropTypes.object,
  isServer: PropTypes.bool,
  info: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user,
  info: state.agencies.agency
});

export default withRedux(initStore, mapStateToProps)(AgencyPage);
