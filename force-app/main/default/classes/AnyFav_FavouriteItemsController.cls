public with sharing class AnyFav_FavouriteItemsController {

    @AuraEnabled(cacheable=true)
    public static List<Object> getFavouriteItems(){
        List<Object> lstRet = new List<Object>();
        String query = AnyFav_Utils.getFavouriteItemsQuery();
        List<Favourite__c> favItems = Database.query(query);
        lstRet.addAll(favItems);
        return lstRet;
    }

    @AuraEnabled
    public static Map<String,Object> saveFavItem(String inStr){
        Map<String,Object> retMap = new Map<String,Object>();
        try{
            Map<String, Object> desObj = (Map<String, Object>) JSON.deserializeUntyped(inStr);
            Favourite__c fav = new Favourite__c();
            if(desObj.containsKey('favItemTitle')){
                fav.Title__c = (String) desObj.get('favItemTitle');
            }
            if(desObj.containsKey('favItemId')){
                fav.Id = (String) desObj.get('favItemId');
            }
            if(desObj.containsKey('favItemURL')){
                fav.Favourite_URL__c = (String) desObj.get('favItemURL');
            }
            if(desObj.containsKey('favItemTags')){
                fav.Tags__c = (String) desObj.get('favItemTags');
            } 
            upsert fav;
            retMap.put('status', 'success');
        }
        catch(Exception ex){
            retMap = AnyFav_Utils.getErrorResponse(ex);
        }
        return retMap;
    }

    @AuraEnabled
    public static Map<String,Object>  deleteItem(String inStr){
        Map<String,Object> retMap = new Map<String,Object>();
        try {
            Id itmId;
            if(inStr != null && inStr != ''){
                itmId = inStr;
                Favourite__c fav = new Favourite__c(Id = itmId);
                delete fav;
            }            
            retMap.put('status', 'success');
        } catch (Exception ex) {
            retMap = AnyFav_Utils.getErrorResponse(ex);
        }
        return retMap;
    }
}
