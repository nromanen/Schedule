export const setDisableButton = (pristine,submitting,id) => {
    if(id!==undefined){
        return false
    }
    if(!pristine){
        return false
    }
    if (submitting){
        return true
    }
    if(id===undefined){
        return true
    }
}