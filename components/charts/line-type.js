import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold } from 'utils/general';

// Components
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, CartesianGrid, Tooltip, Legend } from 'recharts';
import TooltipChart from 'components/charts/tooltip-chart';

// Constants
import { THRESHOLD_COLORS } from 'constants/general';


export default class LineType extends React.Component {
  getLineRefs() {
    const { data } = this.props;
    return data.length ? Object.keys(data[0]).filter(key => key !== 'x') : [];
  }

  render() {
    const { className, threshold, data, y2Axis } = this.props;
    const classNames = classnames({
      'c-line-type': true,
      [className]: !!className
    });
    const yRefs = this.getLineRefs();

    return (
      <div className={classNames}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
          >
            {/* <XAxis dataKey="x" axisLine={false} tickLine={false} />
            <YAxis dataKey="y" yAxisId="left" orientation="left" axisLine={false} tickLine={false} />
            {y2Axis &&
              <YAxis dataKey="y1" yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
            } */}
            <CartesianGrid vertical={false} />
            {yRefs.map((key, i) => {
              const value = data[data.length - 1][key];
              const lineThreshold = y2Axis && key === 'y2' ?
                threshold.y2['break_points'] :
                threshold.y['break_points'];
              const color = THRESHOLD_COLORS[getThreshold(value, lineThreshold)];

              return (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  activeDot={{ r: 3 }}
                  dot={false}
                  yAxisId={y2Axis ? 'right' : 'left'}
                />
              );
            })}
            <Tooltip
              isAnimationActive={false}
              cursor={{ stroke: 'white', strokeWidth: 1 }}
              content={<TooltipChart />}
            />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

LineType.propTypes = {
  className: PropTypes.string,
  threshold: PropTypes.object,
  data: PropTypes.array,
  y2Axis: PropTypes.bool
};
