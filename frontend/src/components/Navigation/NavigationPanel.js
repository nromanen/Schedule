import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import './NavigationPanel.scss';
import { general, tabsComponents } from '../../constants/navigationComponents';
import { links } from '../../constants/links';
import { COMMON_MORE_LABEL } from '../../constants/translationLabels/common';

const NavigationPanel = () => {
    const history = useHistory();
    const { t } = useTranslation('common');
    const [gen, setGen] = useState('');
    const [selectedTab, setSelectedTab] = useState('');

    const getCurrentTabNameByUrl = () => {
        const pathName = history.location.pathname.split('/');
        pathName.shift();
        return pathName[1];
    };

    useEffect(() => {
        const tabByUrl = getCurrentTabNameByUrl();
        if (tabsComponents.indexOf(tabByUrl) === -1) {
            setSelectedTab(tabsComponents.length);
        } else {
            setSelectedTab(tabsComponents.indexOf(tabByUrl));
        }
    }, []);

    const documentTitle = (title) => {
        document.title = t(`${title}_management_title`);
    };
    const handleNavigate = (navigateTo, index) => {
        setSelectedTab(index);
        documentTitle(navigateTo);
        history.push({ ...history.location, pathname: `${links.ADMIN_PAGE}/${navigateTo}` });
    };

    return (
        <Paper className="admin-navigation">
            <List indicatorColor="primary" className="navigation-container">
                {tabsComponents.map((item, index) => (
                    <ListItem
                        selected={selectedTab === index}
                        key={item.name}
                        onClick={() => handleNavigate(item.name, index)}
                        className="navigation-link"
                    >
                        <ListItemText>{t(item.title)}</ListItemText>
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
                        value={gen}
                        displayEmpty
                        onChange={(event) => {
                            const { value: eventValue } = event.target;
                            setGen(eventValue);
                        }}
                    >
                        <MenuItem value="" disabled selected className="navigation-select-item">
                            {t(COMMON_MORE_LABEL)}
                        </MenuItem>
                        {general.map((item) => (
                            <MenuItem
                                key={item.name + item.title}
                                className="navigation-select-item"
                                value={item.name}
                                onClick={() => handleNavigate(item.name, tabsComponents.length)}
                            >
                                {t(item.title)}
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
