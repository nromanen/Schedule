export const isObjectEmpty = (object) => {
    return (
        Object.prototype.toString.call(object) === '[object Object]' &&
        JSON.stringify(object) === '{}'
    );
};
