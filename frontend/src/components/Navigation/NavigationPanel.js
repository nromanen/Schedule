import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import './NavigationPanel.scss';
import { general, tabsComponents } from '../../constants/navigationComponents';
import { ADMIN_PAGE_LINK } from '../../constants/links';
import { COMMON_MORE_LABEL } from '../../constants/translationLabels/common';
import i18n from '../../i18n';

const NavigationPanel = () => {
    const history = useHistory();
    const [selectItem, setSelectItem] = useState('');
    const [selectedTab, setSelectedTab] = useState('');

    const getCurrentTabNameByUrl = () => {
        const pathName = history.location.pathname.split('/');
        pathName.shift();
        return pathName[1];
    };

    useEffect(() => {
        const tabByUrl = getCurrentTabNameByUrl();
        const tabIndex = tabsComponents.findIndex((item) => item.name === tabByUrl);
        if (tabIndex === -1) {
            setSelectedTab(tabsComponents.length);
            setSelectItem(tabByUrl);
        } else {
            setSelectedTab(tabIndex);
        }
    }, []);

    const handleNavigate = (item, index) => {
        setSelectedTab(index);
        document.title = i18n.t(item.title);
        history.push({ ...history.location, pathname: `${ADMIN_PAGE_LINK}/${item.name}` });
    };

    return (
        <Paper className="admin-navigation">
            <List className="navigation-container">
                {tabsComponents.map((item, index) => (
                    <ListItem
                        selected={selectedTab === index}
                        key={item.name}
                        onClick={() => handleNavigate(item, index)}
                        className="navigation-link"
                    >
                        <ListItemText>{i18n.t(item.title)}</ListItemText>
                    </ListItem>
                ))}
                <ListItem
                    className="navigation-link select-container "
                    selected={selectedTab === tabsComponents.length}
                >
                    <Select
                        className="navigation-select"
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        value={selectItem}
                        displayEmpty
                        onChange={(event) => {
                            const { value: eventValue } = event.target;
                            setSelectItem(eventValue);
                        }}
                    >
                        <MenuItem value="" disabled selected className="navigation-select-item">
                            {i18n.t(COMMON_MORE_LABEL)}
                        </MenuItem>
                        {general.map((item) => (
                            <MenuItem
                                key={item.name + item.title}
                                className="navigation-select-item"
                                value={item.name}
                                onClick={() => handleNavigate(item, tabsComponents.length)}
                            >
                                {i18n.t(item.title)}
                            </MenuItem>
                        ))}
                    </Select>
                </ListItem>
            </List>
        </Paper>
    );
};

const mapStateToProps = (state) => ({
    classScheduler: state.classActions.classScheduler,
    ClassScheduleOne: state.classActions.classScheduleOne,
});

export default connect(mapStateToProps, {})(NavigationPanel);
