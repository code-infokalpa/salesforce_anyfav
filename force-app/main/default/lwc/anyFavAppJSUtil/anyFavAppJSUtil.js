import saveFavItem from '@salesforce/apex/AnyFav_FavouriteItemsController.saveFavItem';
import deleteItem from '@salesforce/apex/AnyFav_FavouriteItemsController.deleteItem';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const Utils = {};

Utils.prepareItems = (retData) => {
    let retItems = [];
    for(let indx in retData){
        let item = {};
        let tmpItem = Object.assign({},retData[indx]);
        item.title = tmpItem[Utils.getFetchItemmapping.title];
        item.url = tmpItem[Utils.getFetchItemmapping.url];
        item.id = tmpItem[Utils.getFetchItemmapping.id];
        item.tags = Utils.getTags(tmpItem[Utils.getFetchItemmapping.tags]);
        retItems.push(item);
    }
    return retItems;
} 

Utils.getSaveItemMapping = {
    id : 'favItemId',
    title : 'favItemTitle',
    url : 'favItemURL',
    tags : 'favItemTags'
}

Utils.getFetchItemmapping = {
    title : 'Title__c',
    url : 'Favourite_URL__c',
    tags : 'Tags__c',
    id : 'Id'
}

Utils.getBlankFavItem = () => {
    let prepPayload = {};
    prepPayload.title = '';
    prepPayload.url = '';
    prepPayload.tags = '';
    return prepPayload;
}

Utils.getCurrentURL = () => {
    let retURL = '';
    if(location.pathname !== undefined && location.pathname !== ''){
        retURL = retURL + location.pathname;
    }
    if(location.hash !== undefined && location.hash !== ''){
        retURL = retURL + location.hash;
    }
    if(location.search !== undefined && location.search !== ''){
        retURL = retURL + location.search;
    }
    return retURL;
}

Utils.getTags = (tagsStr) => {
    return tagsStr !== undefined && tagsStr !== ''? tagsStr.split(',') : [];    
}

Utils.getMatchingItemFromItems = (iId, items) => {
    //console.log('test-- ', iId,items);
    let retItm;
    for(let itm of items){
        if(itm.id !== undefined && itm.id === iId){
            retItm = itm;
        }
    }
    return retItm;
}

Utils.search = (items,searchKey) => {
    let retItems;
    retItems =  items.filter(item => item.title.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1);
    return retItems;
}

Utils.searchByTags = (items,searchKey) => {
    let checker = (arr, target) => target.every(v => arr.includes(v.toLowerCase()));
    let retItems = [];
    let lowerSearchKey = searchKey.toLowerCase().replace(/\s+/g, ',');
    let searchKeyTmp = lowerSearchKey.split(',');
    var searchKeyArray = searchKeyTmp.filter(el => {
        return el != null && el.indexOf('#') !== -1;
      });
    let srchKeyArrayWithoutHash = [];
    for(let ky of searchKeyArray){
        srchKeyArrayWithoutHash.push(ky.replace('#', ''));
    }
    retItems =  items.filter(item => {
        let tagsArray = item.tags.map(v => v.toLowerCase());
        if(tagsArray !== undefined && tagsArray.length > 0){
            const ifFind = checker(tagsArray,srchKeyArrayWithoutHash);
            if(ifFind !== undefined && ifFind === true){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }  
        
    });
    return retItems;
}

Utils.splitToArray = (strText, existingArray) => {
    let arry = strText.split(",");
    for(const itm of arry){
        if(itm !== undefined){
            existingArray.push({label: itm, index: existingArray.length})
        }        
    }
    return existingArray;
}
Utils.rearrangeArrayIndex = (existingArray) => {
    
    for(let i=0;i<existingArray.length;i++){
        existingArray[i].index = i;
    }
    return existingArray;
}

Utils.getKeysString = (existingArray) => {
    let retStr = '';
    for(let i=0;i<existingArray.length;i++){
        retStr = retStr + existingArray[i].label + ',';
    }

    return retStr.replace(/,\s*$/, "");
}

Utils.saveItem = (payload) => {
    return new Promise(function(resolve, reject){
        saveFavItem({inStr : JSON.stringify(payload)})
        .then(result => {
            if(result.status === 'success'){
                //console.log('saved!');
                resolve(result);
            }
            else{
                console.log('an error occured while saving fav item');
                reject(result);
            }
        })
        .catch(error => {
            reject(error);
        })
    })
    
}

Utils.deleteFavItem = (itmId) => {
    return new Promise(function(resolve, reject){
        deleteItem({inStr : itmId})
        .then(result => {
            if(result.status === 'success'){
                //console.log('deleted!');
                resolve(result);
            }
            else{
                console.log('an error occured while deleting fav item');
                reject(result);
            }
        })
        .catch(error => {
            reject(error);
        })
    })
}

Utils.showSuccessToast = (ttl, msg) => {
    const evt = new ShowToastEvent({
        title: ttl,
        message: msg,
        variant: 'success',
    });
    this.dispatchEvent(evt);
}

export default Utils;