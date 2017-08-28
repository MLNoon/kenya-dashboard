import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Modules
import { getIndicators, setIndicatorDates } from 'modules/indicators';
import { removeSelectedFilter, setFiltersUrl } from 'modules/filters';
import { setUser } from 'modules/user';

// Selectors
import { getSelectedFilterOptions } from 'selectors/filters';

// Libraries
import isEqual from 'lodash/isEqual';

// Utils
import { setIndicatorsWidgetsList } from 'utils/indicators';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import FiltersSelectedBar from 'components/ui/filters-selected-bar';
import DashboardList from 'components/ui/dashboard-list';
// import Spinner from 'components/ui/spinner';


class DashboardPage extends Page {
  componentDidMount() {
    const { selectedFilters } = this.props;

    // Set user
    if (localStorage.token && localStorage.token !== '') {
      this.props.setUser({ auth_token: localStorage.token });
    }

    if (this.props.user.logged && !this.props.indicators.list.length) {
      this.props.getIndicators(selectedFilters);
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((!this.props.user.logged && nextProps.user.logged) ||
      (nextProps.user.logged && !isEqual(this.props.selectedFilters, nextProps.selectedFilters))) {
      this.props.getIndicators(nextProps.selectedFilters);
    }
  }

  render() {
    const {
      url,
      session,
      indicators,
      layout,
      user,
      selectedFilterOptions,
      selectedFilters,
      filterOptions
    } = this.props;

    return (
      <Layout
        title="Dashboard"
        description="Dashboard description..."
        url={url}
        session={session}
        logged={user.logged}
      >
        {user.logged ?
          <div>
            <FiltersSelectedBar
              filterOptions={filterOptions}
              selected={selectedFilterOptions}
              removeFilter={this.props.removeSelectedFilter}
            />
            <DashboardList
              list={setIndicatorsWidgetsList(indicators.list, true)}
              dates={indicators.dates}
              layout={layout}
              withGrid
              region={
                selectedFilters.regions && selectedFilters.regions.length ?
                  selectedFilters.regions[0] : ''
              }
              onSetDate={this.props.setIndicatorDates}
            />
          </div> :
          // Provisional
          <div className="row collapse" style={{ margin: '30px' }}>
            <div className="column small-12"><p>Sign in</p></div>
          </div>
        }
      </Layout>
    );
  }
}

DashboardPage.propTypes = {
  url: PropTypes.object,
  session: PropTypes.object
};

export default withRedux(
  initStore,
  state => ({
    indicators: state.indicators,
    selectedFilterOptions: getSelectedFilterOptions(state),
    selectedFilters: state.filters.selected,
    layout: state.filters.layout,
    user: state.user
  }),
  dispatch => ({
    // User
    setUser(user) { dispatch(setUser(user)); },
    // Indicators
    getIndicators(filters) { dispatch(getIndicators(filters)); },
    setIndicatorDates(indicator, dates) { dispatch(setIndicatorDates(indicator, dates)); },
    // Filters
    removeSelectedFilter(type, value) {
      dispatch(removeSelectedFilter(type, value));
      dispatch(setFiltersUrl());
    }
  })
)(DashboardPage);
