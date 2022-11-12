import { LightningElement,api, wire, track } from 'lwc';
import getFavouriteItems from '@salesforce/apex/AnyFav_FavouriteItemsController.getFavouriteItems';
import { refreshApex } from '@salesforce/apex';
import Utils from 'c/anyFavAppJSUtil';

export default class AnyFavApp extends LightningElement {
    @api name;
    externalSite;
    @track searchWord;
    items;
    originalItems;
    @track visibilityState;
    retResponse;
    favItem;

    connectedCallback(){
        console.log("hello!",location)
        this.visibilityState = {showItemsList : true, showAddForm: false};
    }

    @wire(getFavouriteItems)
    favouriteItems(result) {
        this.retResponse = result;
        if (result.data) {
            this.items = Utils.prepareItems(result.data);
            this.originalItems = [...this.items];//Object.assign({},this.items);
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.items = undefined;
        }
    } 
    handleChange(evt){
        this.searchWord = evt.target.value;
        console.log('search terms: ',  this.searchWord);
        if(this.searchWord.startsWith('#')){
            this.items = Utils.searchByTags(this.originalItems, this.searchWord);
        }
        else{
            this.items = Utils.search(this.originalItems, this.searchWord);
        }
        
        console.log('items--- ', this.items);
    }   

    handleAddItem(evt){
        this.favItem = Utils.getBlankFavItem();
        this.visibilityState = this.toggleForms(this.visibilityState, 'showAddForm');
    }

    handleTagItemClick(evt){
        if(evt.detail.type !== undefined && evt.detail.type == 'tagitem' && evt.detail.data !== undefined){
            this.searchWord = (this.searchWord === '' || this.searchWord === undefined ? '' : this.searchWord + ',') + '#' + evt.detail.data;
        }
        this.items = Utils.searchByTags(this.originalItems, this.searchWord);
    }

    toggleForms(visibilityState, state){
        if(visibilityState.hasOwnProperty(state)){
            for (const property in visibilityState){
                if(state === property){
                    visibilityState[property] = true;
                }
                else{
                    visibilityState[property] = false;
                }
            }


        }
        return visibilityState;
    }

    handleAddItemButton(evt){
        console.log('on item event- ', evt.detail);
        if(evt.detail.type !== undefined && evt.detail.type == 'cancel'){
            this.visibilityState = this.toggleForms(this.visibilityState, 'showItemsList');
        }
        if(evt.detail.type !== undefined && evt.detail.type == 'done'){
            refreshApex(this.retResponse);
            this.visibilityState = this.toggleForms(this.visibilityState, 'showItemsList');
        }
    }
    
    handleActionItem(evt){
        if(evt.detail.type !== undefined && evt.detail.type == 'delete'){
            refreshApex(this.retResponse);
        }
        else if(evt.detail.type !== undefined && evt.detail.type == 'edit'){
            this.favItem = Utils.getMatchingItemFromItems(evt.detail.data, this.originalItems);
            this.visibilityState = this.toggleForms(this.visibilityState, 'showAddForm');
        }
    }

}