import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Utils from 'c/anyFavAppJSUtil';

export default class AnyFavListFavItems extends LightningElement {
    @api items;


    handleMenuItemSelect(evt){
        let selectedItemValue = evt.target.value;
        if(selectedItemValue === 'delete'){
            Utils.deleteFavItem(evt.target.dataset.favItem).then(rslt => {
                console.log('success');
                //Utils.showSuccessToast('Success', 'URL saved as Favourite');
                //this.fireEvent('','done');
                const evt = new ShowToastEvent({
                    title: 'Success',
                    message: 'Favourite item deleted',
                    variant: 'success',
                });
                this.dispatchEvent(evt);
                this.fireEvent('','delete')
            })
            .catch(error => {
                console.log('promise error- ', error)
            })
        }
        if(selectedItemValue === 'edit'){
            let itm = evt.target.dataset.favItem;
            this.fireEvent(itm,'edit');
        }
    }

    handleTagClick(evt){
        let tagVal = evt.target.dataset.ctag;
        console.log('tag-clicked',tagVal);
        this.fireEventTagItem(tagVal,'tagitem');
    }

    fireEvent(inputData, type){
        // Creates the event with the contact ID data.
        const evt = new CustomEvent('itemaction', { detail: {type: type, data: inputData} });

        // Dispatches the event.
        this.dispatchEvent(evt);
    }

    fireEventTagItem(inputData, type){
        // Creates the event with the contact ID data.
        const evt = new CustomEvent('tagitemclick', { detail: {type: type, data: inputData} });

        // Dispatches the event.
        this.dispatchEvent(evt);
    }
}