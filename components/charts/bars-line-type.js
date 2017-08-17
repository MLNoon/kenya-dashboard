import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold } from 'utils/general';

// Components
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

// Constants
import { THRESHOLD_COLORS } from 'constants/general';
import TooltipChart from 'components/charts/tooltip-chart';


export default class BarsType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: ''
    };

    // Bindings
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter(ref) {
    this.setState({ hover: ref });
  }

  onMouseLeave() {
    this.setState({ hover: '' });
  }

  render() {
    const { className, threshold, data, y2Axis } = this.props;
    const classNames = classnames(
      'c-bars-line-type',
      { [className]: !!className }
    );
    const barsThreshold = threshold.y['break_points'];
    const lineThreshold = y2Axis ? threshold.y1['break_points'] : threshold.y['break_points'];
    const value = data[data.length - 1].y1;
    const lineColor = THRESHOLD_COLORS[getThreshold(value, lineThreshold)];

    return (
      <div className={classNames}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <XAxis dataKey="x" axisLine={false} tickLine={false} />
            <YAxis dataKey="y" yAxisId="left" orientation="left" axisLine={false} tickLine={false} />
            {y2Axis &&
              <YAxis dataKey="y1" yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
            }
            <CartesianGrid vertical={false} />
            <Tooltip
              offset={10}
              isAnimationActive={false}
              cursor={false}
              content={<TooltipChart />}
            />
            <Legend />

            {/* Shapes */}
            <Bar
              dataKey="y"
              fill="#2E3D3D"
              yAxisId="left"
            >
              {/* Set each bar hover color */}
              {data.map((item, j) => {
                const color = THRESHOLD_COLORS[getThreshold(item.y, barsThreshold)];

                return (
                  <Cell
                    key={j}
                    fill={this.state.hover === `y-${j}` ? color : '#2E3D3D'}
                    onMouseEnter={() => this.onMouseEnter(`y-${j}`)}
                    onMouseLeave={this.onMouseLeave}
                  />
                );
              })}
            </Bar>
            <Line
              type="monotone"
              yAxisId={y2Axis ? 'right' : 'left'}
              dataKey="y1"
              stroke={lineColor}
              strokeWidth={2}
              activeDot={{ r: 3 }}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

BarsType.propTypes = {
  className: PropTypes.string,
  threshold: PropTypes.object,
  data: PropTypes.array,
  y2Axis: PropTypes.bool
};
