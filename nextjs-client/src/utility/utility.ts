import { cloneDeep, uniqueId } from "lodash";
import moment from 'moment';

export const toObjectPayload = (key: string, value: unknown): Record<string, unknown> => {
    const obj: Record<string, unknown> = {};
    obj[key] = value;
    return obj;
};

export const createDataClone = (data: Record<string, unknown>[]): Record<string, unknown>[] => {
    const dataCopy = cloneDeep(data);
    dataCopy.map(dataSet => {
        (dataSet as Record<string, unknown>)['isModified'] = false;
        (dataSet as Record<string, unknown>)['isAdded'] = false;
        (dataSet as Record<string, unknown>)['isDeleted'] = false;
        (dataSet as Record<string, unknown>).uid = uniqueId();
        return dataSet;
    });
    return dataCopy;
};

export const filterObject = (filters: Record<string, unknown>, pageNames: string[]): Record<string, unknown> => {
    return filters && Object.keys(filters).length > 0 ?
        Object.keys(filters).filter(key => pageNames.map((type) => type).includes(key))
            .reduce((obj: Record<string, unknown>, key: string) => {
                obj[key] = filters[key];
                return obj;
            }, {}) : {};
};

export const filterList = (filters: Record<string, Record<string, unknown>>, pageNames: string[]): Record<string, unknown> => {
    const filtersList: Record<string, unknown> = {};
    pageNames.map(page => Object.keys(filters[page]).map(key => filtersList[key] = filters[page][key]));
    return filtersList;
};

export const makePageOffsetLimit = (currentPage: number, pageSize: number): { offset: number; limit: number } => {
    return {
        offset: currentPage === 1 ? 0 : (pageSize * (currentPage - 1)) + 1,
        limit: pageSize
    };
};


export const stringifyValues = (inputData: unknown): unknown => {
    if (typeof inputData === 'string') {
        return inputData
    }
    if (typeof inputData === 'number') {
        return inputData.toString()
    } else if (Array.isArray(inputData)) {
        return inputData.map(ele => stringifyValues(ele))
    } else if (typeof (inputData) === 'object') {
        if (Array.isArray(inputData)){
            inputData.map(ele => stringifyValues(ele))
        }else{
            const result: Record<string, unknown> = {};
            for (const key in inputData) {
                result[key] = stringifyValues((inputData as Record<string, unknown>)[key])
            }
            return result
        }
    } else {
        return inputData !== undefined ? inputData.toString() : inputData;
    }
};

// export const makeOutputResponse = (reponseHeaderTitle = 'Success', response) => {
//     let successMessage = ''
//     let errorMessage = ''
//     let error = []
//     if (typeof response === 'object') {
//         const keysInResponse = Object.keys(response)
//         keysInResponse.map(key => {
//             if (key === 'success' && response[key] !== '') {
//                 successMessage += response[key]
//             }
//             if (key === 'errorMessage' && response[key] !== '') {
//                 errorMessage += response[key]
//             }
//             if (key === 'mainError' && response[key] !== ''){
//                 console.log(`Main Error: ${String(response[key])}`)
//             }
//             if (key === 'error' && Array.isArray(response[key]) && !isEmpty(response[key])) {
//                 error += Array(response[key]).join(", ")
//             }
//             return true;
//         })
//         if (successMessage !== '') {
//             successModal(reponseHeaderTitle, successMessage)
//             return true;
//         }
//         if (errorMessage !== '') {
//             infoModal(reponseHeaderTitle, errorMessage)
//             if (error != '') {
//                 if ('clipboard' in navigator) {
//                     navigator.clipboard.writeText(error)
//                 }
//             }
//             return false;
//         }
//     };
// };

export const toMillions = (value: number) => {
    return value > 0
        ? parseFloat((Math.abs(Number(value)) / 1000000).toFixed(3))
        : -parseFloat((Math.abs(Number(value)) / 1000000).toFixed(3));
};

export const toThousands = (value: number) => {
    return value > 0
        ? parseFloat((Math.abs(value) / 1000).toFixed(2))
        : -parseFloat((Math.abs(value) / 1000).toFixed(2));
};

// const changeObjValue = (
//     obj, revertToLastState,
//     newCurr, lastCurr, excludeCol,
//     includeCol, type = "object", debug
// ) => {
//     if (debug) {
//         debugger;
//     }
//     if (type === "object") {
//         Object.keys(obj).map((key) => {
//             if (debug) {
//                 debugger;
//             }
//             if (Array.isArray(obj[key]) || typeof obj[key] === "object") {
//                 obj[key] = changeObjValue(
//                     obj[key], revertToLastState, newCurr, lastCurr, excludeCol, includeCol, typeof obj[key] === "object" ? "object" : "list", debug
//                 );
//             } else {
//                 if (!isNaN(parseInt(obj[key])) && (
//                     includeCol.length > 0 ? includeCol.includes(key) : !excludeCol.includes(key)
//                 )
//                 ) {
//                     obj[key] = revertToLastState ? parseFloat((obj[key] / lastCurr) * newCurr).toFixed(2) : parseFloat(obj[key] * newCurr).toFixed(2);
//                 }
//             }
//             return key;
//         });
//     } else {
//         if (debug) {
//             debugger;
//         }
//         let data = obj;
//         obj = [];
//         data.map((o) => {
//             let a = o;
//             if (Array.isArray(o) || typeof o === "object") {
//                 a = changeObjValue(
//                     o, revertToLastState, newCurr, lastCurr, excludeCol, includeCol, typeof o === "object" ? "object" : "list", debug // deepscan-disable-line
//                 );
//             } else {
//                 if (!isNaN(parseInt(o))) {
//                     a = revertToLastState ? parseFloat((o / lastCurr) * newCurr).toFixed(2) : parseFloat(o * newCurr).toFixed;
//                 }
//             }
//             obj.push(a);
//             return o
//         });
//     }
//     return obj;
// };

// export const convertListCurrency = (
//     data, revertToLastState = false,
//     newCurr = 0, lastCurr = 0,
//     excludeCol = [], includeCol = [], debug = false
// ) => {
//     if (debug) {
//         debugger;
//     }
//     if (Array.isArray(data)) {
//         let newList = [];
//         data.map((obj) => {
//             newList.push(
//                 changeObjValue(
//                     obj, revertToLastState, newCurr, lastCurr, excludeCol, includeCol, Array.isArray(obj) ? "list" : "object"
//                 )
//             );
//             return obj;
//         });
//         return newList;
//     } else {
//         let _data = changeObjValue(
//             data, revertToLastState, newCurr, lastCurr, excludeCol, includeCol, "object", debug
//         );
//         console.log('currencydata', _data);
//         return _data;
//     }
// };

export function extractKeyValue(obj: Record<string, unknown>, key : string): unknown {
    if (Array.isArray(obj)) {
        return obj.map(item => extractKeyValue(item, key));
    } else if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.includes(key)) {
            return obj[key];
        } else {
            return Object.values(obj).map(item => extractKeyValue(item as Record<string, unknown>, key));
        }
    } else {
        return null;
    }
}


export function isKeyInObject(obj: Record<string, unknown>, key: string): boolean {
    if (Array.isArray(obj)) {
        return obj.some(item => isKeyInObject(item as Record<string, unknown>, key));
    } else if (typeof obj === 'object' && obj !== null) {
        const keys = Object.keys(obj);
        if (keys.includes(key)) {
            return true;
        } else {
            return Object.values(obj).some(item => isKeyInObject(item as Record<string, unknown>, key));
        }
    } else {
        return false;
    }
}

export function displayDateTimeMessage() {
    const date = new Date();
    const year = moment().year();
    const month = moment(moment().get("M")).format('MMM');
    const day = ("0" + date.getDate()).slice(-2);
    const hours = date.getHours();

    let timeOfDay;
    let message;
    if (hours < 12) {
        timeOfDay = "Happy Morning";
        message = "How are you doing today?";
    } else if (hours < 17) {
        timeOfDay = "Happy Afternoon";
        message = "Hope you're having a productive day!";
    } else if (hours < 20) {
        timeOfDay = "";
        message = "Good Evening! How was your day?";
    } else {
        timeOfDay = "Night Time It Is";
        message = "Hey Lad, please have some sleep.";
    }

    const formattedDate = `${month} ${day}, ${year}, ${timeOfDay} - ${message}`;
    return formattedDate;
}