import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import Fuse from 'fuse.js';

// Constants
import { SELECT_SEARCH_OPTIONS } from 'constants/general';

// Components
import Icon from 'components/ui/icon';


export default class SelectList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredList: props.list
    };

    // Bindings
    this.onSearch = this.onSearch.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  /**
    Lifecycle
  */
  componentWillReceiveProps(nextProps) {
    this.setState({ filteredList: nextProps.list });
  }

  /**
    UI events
  */
  onSearch(e) {
    const value = e.currentTarget.value;
    const fuse = new Fuse(this.props.list, SELECT_SEARCH_OPTIONS);
    const filteredList = value !== '' ? fuse.search(value) : this.props.list;
    this.setState({ filteredList });
  }

  onClick(e) {
    const value = e.currentTarget.getAttribute('data-value');
    const isParent = e.currentTarget.getAttribute('data-is-parent');

    if (!this.props.list.list && this.props.setValue) {
      this.props.setValue(value, this.props.name);
    } else if (isParent) {
      this.props.onToggle('next', value);
    }
  }

  render() {
    const { className, type, search, searchPlaceholder } = this.props;
    const classNames = classnames(
      'c-select-list',
      {
        [className]: !!className
      }
    );

    return (
      <div className={classNames}>
        {/* Search */}
        {search &&
          <div className="">
            <input type="text" onKeyUp={this.onSearch} placeholder={searchPlaceholder} />
            <Icon name="icon-search" className="" />
          </div>
        }

        {/* List */}
        <ul className="list">
          {this.state.filteredList.map((l, i) => (
            <li
              key={i}
              data-value={l.id}
              data-is-parent={l.list && l.list.length}
              onClick={this.onClick}
            >
              {/* Checkbox */}
              {type === 'checkbox' && <input type="checkbox" />}

              {/* Name */}
              <span>{l.name}</span>

              {/* Switch to own list if exists */}
              {l.list && l.list.length > 0 && <Icon name="icon-arrow-right" className="" />}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

SelectList.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  list: PropTypes.array.isRequired,
  selected: PropTypes.array,
  search: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  // Actions
  setValue: PropTypes.func,
  onToggle: PropTypes.func
};

SelectList.defaultProps = {
  searchPlaceholder: 'Search'
};
