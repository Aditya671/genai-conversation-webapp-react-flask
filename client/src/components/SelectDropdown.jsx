import React, { useState, useEffect } from 'react'
import { Checkbox, Select, Divider } from 'antd';
import { setFilterData } from '../services/base';
import { useDispatch } from 'react-redux';
import { isEmpty, isNull } from 'lodash';
import { DownOutlinedSVG } from '../assets/svg/DownOutlinedSVG';

const SelectDropdown = (props) => {
    const {
        componentName = 'select-button', filterOptions = [], sortOptions = true, defaultValue = null, onChange = null, selectionType = 'multiple',
        onBeforeChange = null, onClearFilter = null, filterLabel = null, showSelectAllOption = true,
        includeParentFilters = null, pageName = '', form = null, onScroll = null, ...rest
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
                setFilterData(
                    pageName, userSelectedComponentName,
                    (userSelectedComponentName.includes('Id') && Array.isArray(userSelectedValue)) ?
                        userSelectedValue.map(val => typeof val === 'string' ? val : parseInt(val)) : userSelectedValue
                )
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
                name={componentName}
                mode={selectionType}
                size={'medium'}
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
                    width: '100%', maxWidth: '98%', minWidth: '240px'
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