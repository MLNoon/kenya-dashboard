import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

// Utils
import { get } from 'utils/request';

// Components
import { Link } from 'routes';
import ItemTools from 'components/ui/item-tools';
import TableType from 'components/indicators/table-type';
import ArcType from 'components/indicators/arc-type';
import Spinner from 'components/ui/spinner';
import Icon from 'components/ui/icon';
import TopicIcon from 'components/ui/topic-icon';

// Constants
import { EXAMPLE_QUERY_DATA } from 'constants/indicators';


export default class DashboardItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: undefined
    };

    this.defaultWidget = props.info.widgets.find(w => w.default);

    // Bindings
    this.setData = this.setData.bind(this);
  }

  componentWillMount() {
    this.getIndicatorData();
  }

  getIndicatorData() {
    const { query } = this.props.info;
    if (query && query !== '') {
      get({
        url: query,
        onSuccess: this.setData,
        onError: this.setData
      });
    } else {
      // TODO Provisional query data
      this.setState({ data: EXAMPLE_QUERY_DATA });

      // this.setState({ data: null });
    }
  }

  setData() {
    // TODO Provisional query data
    this.setState({ data: EXAMPLE_QUERY_DATA });

    // this.setState({ data });
  }

  getItemType() {
    switch (this.props.info.type) {
      case 'table': return <TableType data={this.state.data} />;
      case 'arc': return <ArcType data={this.state.data} />;
      default: return '';
    }
  }

  getThreshold(thresholdVal) {
    // let currentThreshold;
    //
    // Object.keys(this.props.info.threshold).forEach((key) => {
    //   if (+thresholdVal > +this.props.info.threshold[key]) {
    //     currentThreshold = key;
    //   }
    // });
    //
    // return currentThreshold;
    return 'default'
  }

  render() {
    const { info, className } = this.props;
    const { data } = this.state;
    // const widgetThreshold = this.defaultWidget.json_config.threshold;
    // const threshold = data && data.threshold ? this.getThreshold(data.threshold) : null;

    const classNames = classnames({
      'c-dashboard-item': true,
      [className]: !!className
      // [`-${threshold || 'default'}`]: !!widgetThreshold && !isEmpty(widgetThreshold) && !!data && !!data.threshold
    });
    const modalInfo = { ...this.defaultWidget, ...{ updatedAt: info.updatedAt } };

    return (
      <article className={classNames}>
        {/* Header */}
        <header className="item-header">
          <h1 className="item-title">{this.defaultWidget && this.defaultWidget.title}</h1>
          <div className="item-tools">
            <ItemTools info={modalInfo} />
          </div>
        </header>

        {/* Indicator type detail - Content */}
        <section className="type-detail">
          <Spinner isLoading={this.state.data === undefined} />
          {this.state.data !== undefined && !isEmpty(this.state.data) &&
            this.getItemType()}
        </section>

        {/* Footer */}
        <footer className="item-footer">
          <div className="info">
            <TopicIcon topic={info.topic ? info.topic.name : ''} tooltip />
            <span className="update">Last update: {info.updatedAt}</span>
          </div>
          <div className="">
            <Link route="compare" params={{ indicators: info.id }}>
              <a className="item-link">
                <Icon name="icon-arrow_next" className="-smaller" />
              </a>
            </Link>
          </div>
        </footer>
      </article>
    );
  }
}

DashboardItem.propTypes = {
  info: PropTypes.object,
  className: PropTypes.string
};

DashboardItem.defaultProps = {
  info: {}
};
