import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Utils from 'c/anyFavAppJSUtil';

export default class AnyFavAddFavItem extends LightningElement {

    @track title;
    @track tagPills = [];
    tags = '';
    url;
    @track favItem;

    @api
    get item() {
        return this.favItem;
    }

    set item(value) {
        this.favItem = Object.assign({}, value);
        for (let idx in value.tags) {
            this.tagPills.push({ label: value.tags[idx], index: idx })
        }
    }

    connectedCallback() {

        if (this.favItem.title === undefined || this.favItem.title === '') {
            this.favItem.title = document.title;
            this.tagPills.push({ label: this.favItem.title.replace(/ .*/, ''), index: 0 });
        }

    }

    handleCancelClick(evt) {
        this.fireEvent('', 'cancel');
    }

    handleTitleChange(evt){
        this.favItem.title = evt.detail.value;
    }

    handleTagsEnter(evt) {
        if (evt.keyCode === 13) {
            this.tagPills = Utils.splitToArray(evt.target.value, this.tagPills);
        }
    }
    handleRemoveTag(evt) {
        this.tagPills.splice(parseInt(evt.target.dataset.pillId), 1);
        this.tagPills = Utils.rearrangeArrayIndex(this.tagPills);
    }

    handleAddItemClick(evt) {
        let prepPayload = {}
        prepPayload[Utils.getSaveItemMapping.title] = this.favItem.title;
        prepPayload[Utils.getSaveItemMapping.id] = this.favItem.id;
        prepPayload[Utils.getSaveItemMapping.url] = Utils.getCurrentURL();
        prepPayload[Utils.getSaveItemMapping.tags] = Utils.getKeysString(this.tagPills);
        Utils.saveItem(prepPayload).then(rslt => {
            //console.log('success',JSON.stringify(prepPayload),rslt);
            //Utils.showSuccessToast('Success', 'URL saved as Favourite');
            this.fireEvent('', 'done');
            const evt = new ShowToastEvent({
                title: 'Success',
                message: 'URL saved as Favourite',
                variant: 'success',
            });
            this.dispatchEvent(evt);
        })
            .catch(error => {
                console.log('promise error- ', error)
            })
    }


    fireEvent(inputData, type) {
        // Creates the event with the contact ID data.
        const evt = new CustomEvent('additembutton', { detail: { type: type, data: inputData } });

        // Dispatches the event.
        this.dispatchEvent(evt);
    }
}