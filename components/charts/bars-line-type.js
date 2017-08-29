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

  setLegendValues() {
    const { config, data, y2Axis, threshold } = this.props;
    const values = [];

    if (config.axes && Object.keys(config.axes).length) {
      Object.keys(config.axes).forEach((key) => {
        if (key[0] === 'y' && config.axes[key]) {
          const value = data[data.length - 1][key];
          const lineThreshold = y2Axis && key === 'y2' ?
            threshold.y2['break-points'] :
            threshold.y['break-points'];
          const color = THRESHOLD_COLORS[getThreshold(value, lineThreshold)];
          values.push({ value: config.axes[key].title, type: 'line', id: key, color });
        }
      });
    }
    return values;
  }

  render() {
    const { className, threshold, data, y2Axis } = this.props;
    const classNames = classnames(
      'c-bars-line-type',
      { [className]: !!className }
    );
    const barsThreshold = threshold && threshold.y ? threshold.y['break-points'] : {};
    // const lineThreshold = y2Axis ? threshold.y2['break-points'] : threshold.y['break-points'];
    // const value = data[data.length - 1].y2;
    const lineColor = '#FF6161';
    // const lineColor = THRESHOLD_COLORS[getThreshold(value, lineThreshold)];
    const legendValues = this.setLegendValues();

    return (
      <div className={classNames}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <XAxis
              dataKey="x"
              axisLine={false}
              tickLine={false}
              tickFormatter={(...t) => {
                const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
                const month = new Date(t).getUTCMonth();
                return months[month];
              }}
            />
            <YAxis dataKey="y" yAxisId="left" orientation="left" axisLine={false} tickLine={false} />
            {y2Axis &&
              <YAxis dataKey="y2" yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
            }
            <CartesianGrid vertical={false} />
            <Tooltip
              offset={10}
              isAnimationActive={false}
              cursor={false}
              content={<TooltipChart />}
            />
            <Legend payload={legendValues} />

            {/* Shapes */}
            <Bar
              dataKey="y2"
              fill="#2E3D3D"
              yAxisId={y2Axis ? 'right' : 'left'}
            >
              {/* Set each bar hover color */}
              {data.map((item, j) => {
                // const color = THRESHOLD_COLORS[getThreshold(item.y, barsThreshold)];
                const color = '#734CD4';

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
              yAxisId="left"
              dataKey="y"
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
  config: PropTypes.object,
  threshold: PropTypes.object,
  data: PropTypes.array,
  y2Axis: PropTypes.bool
};
