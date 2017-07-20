import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';


// Components
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import ExpandMap from 'components/ui/expand-map';
import Icon from 'components/ui/icon';


const SortableItem = SortableElement(({ value }) => value);

const DragHandle = SortableHandle(() => (
  <span className="handler">
    {/* <Icon name="icon-drag-dots" className="-small" /> */}
    Drag
  </span>
));

const SortableList = SortableContainer(({ items }) => (
  <ul className="legend-list">
    {items.map((value, index) =>
      <SortableItem key={`item-${index}`} index={index} value={value} />
    )}
  </ul>
));

class Legend extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    // BINDINGS
    this.onToggle = this.onToggle.bind(this);
    this.onToggleLayer = this.onToggleLayer.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  onToggle() {
    this.setState({ open: !this.state.open });
  }

  onToggleLayer(id) {
    let active = this.props.indicatorsLayersActive.slice();
    if (active.includes(id)) {
      active = active.filter(layerId => layerId !== id);
    } else {
      active.push(id);
    }
    this.props.setIndicatorsLayersActive(active);
  }

  onSortEnd({ oldIndex, newIndex }) {
    const reversed = this.props.list.reverse();
    const newLayersOrder = arrayMove(reversed, oldIndex, newIndex);
    // Unreverse layers to set them in their real order
    const newLayersActive = newLayersOrder.reverse();

    this.props.setIndicatorsLayers(newLayersActive);
  }

  /* Legend visual contents by type */
  getBasicContent(layer) {
    return layer.attributes.legendConfig.items.map((item, i) => (
      <div key={i} className="visual-item">
        <span className="color" style={{ backgroundColor: item.color }} />
        <span className="value">{item.name || item.value}</span>
      </div>
    ));
  }

  getChoroplethGradientContent(layer) {
    return layer.attributes.legendConfig.items.map((item, i) => (
      <div key={i} className="visual-item">
        <span className="color" style={{ backgroundColor: item.color }} />
        <span className="value">{item.value}</span>
      </div>
    ));
  }

  getVisualByLayerType(layer) {
    switch (layer.attributes.legendConfig.type) {
      case 'choropleth': return this.getChoroplethGradientContent(layer);
      case 'gradient': return this.getChoroplethGradientContent(layer);
      case 'basic': return this.getBasicContent(layer);
      default: return 'Not covered';
    }
  }

  /* Legend item structure */
  getLegendItems() {
    // Reverse layers to show first the last one added
    const layersActiveReversed = this.props.list.slice().reverse();
    return layersActiveReversed.map((layer, i) => (
      <li key={i} className={`legend-item -${layer.attributes.legendConfig.type}`}>
        <header className="item-header">
          <div className="item-header">
            <button className="btn-show" onClick={() => this.onToggleLayer(layer.id)}>
              <Icon name="icon-eye" className="" />
            </button>
            <span className="layer-name">{layer.attributes.name}</span>
          </div>
          <div className="item-tools">
            <DragHandle />
          </div>
        </header>
        <div className="layer-visual">
          {this.getVisualByLayerType(layer)}
        </div>
      </li>
    ));
  }

  render() {
    const { className, expanded } = this.props;
    const classNames = classnames({
      'c-legend': true,
      [className]: !!className,
      '-hidden': !this.state.open
    });

    return (
      <div className={classNames}>
        <div className="row">
          <div className="column small-12">
            <header className="legend-header">
              <h2 className="title">
                Legend
                <button className="btn btn-close" onClick={this.onToggle}>
                  <Icon name="icon-arrow-up" className="-smaller" />
                </button>
              </h2>
              <div className="tools">
                <ExpandMap
                  expanded={expanded}
                  setMapExpansion={this.props.setMapExpansion}
                />
              </div>
            </header>
            <div className="legend-content">
              <SortableList
                items={this.getLegendItems()}
                helperClass="c-legend-unit -sort"
                onSortEnd={this.onSortEnd}
                onSortStart={this.onSortStart}
                onSortMove={this.onSortMove}
                axis="y"
                lockAxis="y"
                lockToContainerEdges
                lockOffset="50%"
                useDragHandle
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Legend.propTypes = {
  className: PropTypes.object,
  list: PropTypes.array,
  indicatorsLayersActive: PropTypes.array,
  expanded: PropTypes.bool,
  // Actions
  setIndicatorsLayers: PropTypes.func,
  setIndicatorsLayersActive: PropTypes.func,
  setMapExpansion: PropTypes.func
};

export default Legend;
