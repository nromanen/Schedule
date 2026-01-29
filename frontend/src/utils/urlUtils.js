const getDataFromParams = (location) => {
    const params = new URLSearchParams(location.search);

    const semester = params.get('semester');
    const teacher = params.get('teacher');
    const group = params.get('group');
    const department = params.get('department');

    return { semester, teacher, group, department };
};

export { getDataFromParams };