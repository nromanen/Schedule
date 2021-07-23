export const getFirstLetter=(word)=>{
    return word!==null?`${word.charAt(0)}.`:"";
}
export const getTeacherName=({ teacher })=>{
    const {name,surname,patronymic}=teacher;
    return `${surname} ${getFirstLetter(name)} ${getFirstLetter(patronymic)}`;

}
export const getTeacherForSite=({ teacher })=>{
    const {name,surname,patronymic,position}=teacher;
    return `${position} ${surname} ${getFirstLetter(name)} ${getFirstLetter(patronymic)}`;

}