import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold } from 'utils/general';


export default function ExtremesType(props) {
  const { threshold, className, data } = props;
  const classNames = classnames(
    'c-extremes-type',
    { [className]: !!className }
  );

  return (
    <div className={classNames}>
      {data.map((row, i) => {
        const thresholdValue = getThreshold(row.y, threshold.y['break_points']);
        const trendClasses = classnames(
          'extreme-container',
          { [`-${thresholdValue}`]: !!thresholdValue }
        );

        return (
          <div key={i} className={trendClasses}>
            <p className="value">{row.y}</p>
            <h1 className="title">{row.x}</h1>
          </div>
        );
      })}
    </div>
  );
}

ExtremesType.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  threshold: PropTypes.object
};
