import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import CollapsibleList from 'components/ui/collapsible-list';

export default function IndicatorsList({ indicators, className }) {
  const classNames = classnames({
    'c-indicators-list': true,
    [className]: !!className
  });

  return (
    <div className={classNames}>
      <header className="list-header">
        <h1 className="title">Customise Indicators</h1>
      </header>
      <section className="list-content">
        <div className="row">
          {Object.keys(indicators.list).map((key, i) => (
            <div className="column small-12 medium-4" key={i}>
              <CollapsibleList title={key} list={indicators.list[key]} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

IndicatorsList.propTypes = {
  indicators: PropTypes.object,
  className: PropTypes.string
};
