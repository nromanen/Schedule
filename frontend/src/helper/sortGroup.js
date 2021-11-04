export const sortGroup = (a, b) => {
    return (
        Number(a.title.substr(0, a.title.indexOf(' '))) -
        Number(b.title.substr(0, b.title.indexOf(' ')))
    );
};
