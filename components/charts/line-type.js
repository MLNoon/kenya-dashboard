import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold, roundNumberWithDecimals, setFormat } from 'utils/general';

// Components
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, CartesianGrid, Tooltip, Legend } from 'recharts';
import TooltipChart from 'components/charts/tooltip-chart';

// Constants
import { THRESHOLD_CATEGORY_COLORS } from 'constants/indicators';


export default class LineType extends React.Component {
  constructor(props) {
    super(props);

    this.category = getThreshold(props.data[props.data.length - 1].y, props.threshold.y['break-points']);
    this.colors = THRESHOLD_CATEGORY_COLORS[this.category];
  }

  componentWillReceiveProps(nextProps) {
    this.category = getThreshold(nextProps.data[nextProps.data.length - 1].y, nextProps.threshold.y['break-points']);
    this.colors = THRESHOLD_CATEGORY_COLORS[this.category];
  }

  getLineRefs() {
    const { data } = this.props;
    return data.length ? Object.keys(data[0]).filter(key => key && key[0] === 'y') : [];
  }

  setLegendValues() {
    const { config } = this.props;
    const values = [];

    if (config['legend-config'] && Object.keys(config['legend-config']).length) {
      Object.keys(config['legend-config']).forEach((key, i) => {
        if (key && key[0] === 'y' && config['legend-config'][key]) {
          const color = this.colors ? this.colors[i] : 'grey';
          values.push({ value: config['legend-config'] ? config['legend-config'][key] : '', type: 'line', id: key, color });
        }
      });
    }
    return values;
  }

  render() {
    const { className, data, y2Axis, config } = this.props;
    const classNames = classnames(
      'c-line-type',
      { [className]: !!className }
    );
    const yRefs = this.getLineRefs() || [];
    const legendValues = this.setLegendValues();

    return (
      <div className={classNames}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ left: -5 }}
          >
            <XAxis
              dataKey="x"
              axisLine={false}
              padding={{ left: 10 }}
              tickLine={false}
              tickFormatter={(...t) => {
                return setFormat(t, config.axes.x || null);
              }}
            />

            <YAxis
              dataKey="y"
              yAxisId="left"
              orientation="left"
              padding={{ top: 20 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(...t) => {
                return roundNumberWithDecimals(t);
              }}
            />
            {y2Axis &&
              <YAxis
                dataKey="y2"
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tickFormatter={(...t) => {
                  return roundNumberWithDecimals(t);
                }}
              />
            }
            <CartesianGrid vertical={false} />
            {yRefs.map((key, i) => {
              const color = this.colors ? this.colors[i] : 'grey';

              return (
                <Line
                  key={key}
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
              content={<TooltipChart config={this.props.config['interactivity-config']} />}
              category={this.category}
            />
            <Legend payload={legendValues} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

LineType.propTypes = {
  className: PropTypes.string,
  threshold: PropTypes.object,
  config: PropTypes.object,
  data: PropTypes.array,
  y2Axis: PropTypes.bool
};
