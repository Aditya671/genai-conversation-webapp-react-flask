import React, { useState, useEffect } from 'react'
import { Checkbox, Select, Divider } from 'antd';
import { useDispatch } from 'react-redux';
import { isEmpty, isNull } from 'lodash';
import { DownOutlinedSVG } from '../assets/svg/DownOutlinedSVG';

/**
 * SelectDropdown
 *
 * A highly customizable Ant Design dropdown component supporting multi-select,
 * search, async handling, "select all", and parent-state propagation.
 *
 * @param {string} componentName - Unique identifier for the dropdown.
 * @param {Array} filterOptions - List of options, each with `{ key, label }`.
 * @param {boolean} sortOptions - Whether to sort options alphabetically by label.
 * @param {Array|null} defaultValue - Array of default selected option values.
 * @param {function|null} onChange - Callback fired when selection changes.
 * @param {string} selectionType - AntD selection mode (`'multiple'` or `'tags'`).
 * @param {function|null} onBeforeChange - Callback before dropdown opens.
 * @param {function|null} onClearFilter - Callback when dropdown is cleared.
 * @param {string|null} filterLabel - Optional label for the dropdown field.
 * @param {boolean} showSelectAllOption - Whether to include a "Select All" checkbox.
 * @param {function|null} includeParentFilters - Flag or function to include parent filters in callback.
 * @param {string} pageName - Used for dispatching Redux actions to parent.
 * @param {object|null} form - Optional form reference passed to onChange.
 * @param {function|null} onScroll - Callback for scroll events within the dropdown.
 * @param {function|null} handleSelectDataToParentComponent - Redux or callback function to handle selected data externally.
 * @param {object} rest - Additional props passed to Ant Design's `<Select />` component.
 *
 * @returns {JSX.Element} A customizable searchable select dropdown with optional "select all".
 */

const SelectDropdown = (props) => {
    const {
        componentName = 'dropdown-button', filterOptions = [], sortOptions = true,
        defaultValue = null, onChange = null, selectionType = 'multiple',
        onBeforeChange = null, onClearFilter = null, filterLabel = null, showSelectAllOption = true,
        includeParentFilters = null, pageName = '', form = null, onScroll = null,
        handleSelectDataToParentComponent = null, ...rest
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, SetSelectedValue] = useState([])
    const [options, setOptions] = useState([]);
    const dispatch = useDispatch();


    useEffect(() => {
        setOptions(
            Array.isArray(filterOptions) && filterOptions.length > 0 &&
            filterOptions
                .filter((item, index) => { return index < 500 && !!item.label })
                .map((item) => {
                    return {
                        label: item.label.toString(),
                        value: item.key.toString()
                    }
                }))
    }, [filterOptions])


    useEffect(() => {
        if (!isNull(defaultValue) && !isEmpty(defaultValue) && !isEmpty(filterOptions)) {
            const preSelectedValuesForDropdown = []
            filterOptions.map(obj => defaultValue.includes(obj.value) ? preSelectedValuesForDropdown.push(obj.value) : null)
            SetSelectedValue(defaultValue)
        }
        if (Array.isArray(defaultValue) && isEmpty(defaultValue) && selectionType === 'multiple') {
            SetSelectedValue([])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterOptions])


    const handleBeforeChange = (open) => {
        if (typeof (onBeforeChange) === 'function' && open === true) {
            setIsOpen(open)
            onBeforeChange();
        } else {
            setIsOpen(open);
        }
    }


    const handlePopupScroll = (e) => {
        if (typeof (onScroll) === 'function') {
            onScroll(e);
        }
    }


    
    const handleChange = (userSelectedValue, userSelectedComponentName) => {
        SetSelectedValue(userSelectedValue)
        if (includeParentFilters) {
            dispatch(
                handleSelectDataToParentComponent(pageName, userSelectedComponentName, userSelectedValue)
            )
        }
        if (typeof (onChange) === "function") {
            if (form !== null) {
                onChange(userSelectedValue, userSelectedComponentName, form)
            } else {
                onChange(userSelectedValue, userSelectedComponentName)
            }

        }
    }

    
    const clearFilters = () => {
        if (typeof (onClearFilter) === "function") {
            onClearFilter(() => {
                handleChange([], componentName);
            });
        }
    }

    
    const handleSearch = (searchTerm) => {
        setOptions(
            Array.isArray(filterOptions) && filterOptions?.length > 0 &&
            filterOptions
            .filter((item) => {
                return !!item.label && (item.label.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
            })
            .filter((item, index) => { return index < 500 && !!item.label })
            .map((item) => ({
                    label: item.label.toString(),
                    value: item.key.toString()
                })
            )
        );
    }

    return (
        <>
            {filterLabel === null ? <></> : <p style={{ margin: '8px 0' }}>{filterLabel}</p>}
            <Select
                id={componentName}
                name={componentName}
                mode={selectionType}
                autoComplete="off"
                aria-label={filterLabel || 'Dropdown selection'} // descriptive label for screen readers
                aria-labelledby={filterLabel ? `${componentName}-label` : undefined}
                aria-describedby={filterLabel ? `${componentName}-description` : undefined}
                aria-haspopup="listbox"
                aria-expanded={isOpen} // dynamic instead of hardcoded
                aria-controls={`${componentName}-listbox`} // make sure this points to the dropdown
                aria-autocomplete="list"
                aria-owns={componentName}
                role="combobox"
                size={'middle'}                
                placeholder="Select"
                maxTagCount="responsive"
                popupMatchSelectWidth={false}
                optionLabelProp="label"
                open={isOpen}
                defaultValue={defaultValue !== null && Array.isArray(defaultValue) && !isEmpty(defaultValue) ? defaultValue.map(key => key.toString()) : []}
                allowClear={true}
                onDropdownVisibleChange={handleBeforeChange}
                onChange={(values) => handleChange(values, componentName)}
                style={{
                    width: '240px', minWidth: '200px'
                }}
                onClear={clearFilters}
                suffixIcon={<DownOutlinedSVG />}
                onPopupScroll={handlePopupScroll}
                value={selectedValue}
                showSearch={true}
                onSearch={handleSearch}
                filterSort={(optionA, optionB) => sortOptions ?
                    (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase()) : null}
                filterOption={(input, option) => !!option.label && (option.label.toString().toLowerCase().indexOf(input.toString().toLowerCase()) > -1)}
                options={options}
                {...rest}
                dropdownRender={(menu) => {
                    return (
                        <div>
                            {showSelectAllOption ? (
                                <div
                                    style={{ padding: "4px 8px 8px 8px", cursor: "pointer" }}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <Checkbox
                                        indeterminate={Array.isArray(filterOptions)
                                            && filterOptions.length > 0 && filterOptions.length != selectedValue.length}
                                        checked={Array.isArray(filterOptions)
                                            && filterOptions.length > 0 && filterOptions.length === selectedValue.length}
                                        onChange={(e) => {
                                            if (e.target.checked && (Array.isArray(filterOptions) && filterOptions.length > 0)) {
                                                handleChange(
                                                    filterOptions.map(f => f.key.toString()), componentName
                                                )
                                            } else {
                                                handleChange([], componentName)
                                            }
                                        }}
                                    >
                                        Select all
                                    </Checkbox>
                                </div>
                            ) : <div></div>}
                            <Divider style={{ margin: "2px 0" }} />
                            {menu}
                        </div>
                    );
                }}
            >
            </Select>
        </>
    )
}

export default SelectDropdown;