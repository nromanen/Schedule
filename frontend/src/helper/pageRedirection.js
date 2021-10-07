import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import links from '../constants/links';

export const goToGroupPage = (history) => {
    history.push(links.GroupList);
};
