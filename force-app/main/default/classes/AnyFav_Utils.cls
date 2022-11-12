public with sharing class AnyFav_Utils {
    public AnyFav_Utils() {
        //TODO : delete custom profiles from project folder
    }

    public static String getFavouriteItemsQuery(){
        String queryString = 'select ';
        for(Schema.FieldSetMember fld :SObjectType.Favourite__c.FieldSets.AnyFav_Query_Fields.getFields()) {
         queryString += fld.getFieldPath()  + ',';
        }
        queryString = queryString.removeEnd(',');
        System.debug('Query-- ' + queryString);
        queryString += ' from Favourite__c Where OwnerId = \'' + UserInfo.getUserId() + '\' ' + getMetaConfigAnyFav();
         
        return queryString;
    }

    public static String getMetaConfigAnyFav(){
        AnyFav_Config__mdt config = [Select Id, DeveloperName,After_Where_Clause__c From AnyFav_Config__mdt Where DeveloperName = 'Favourite_Item_After_Where'];
        if(config != null ){
            return config.After_Where_Clause__c;
        }
        else{
            return null;
        }
    }
    public static Map<String, Object> getErrorResponse(Exception ex){
        Map<String, Object> retMap = new Map<String, Object>();
        retMap.put('status', 'error');
        retMap.put('message', ex.getMessage());
        retMap.put('detail', ex.getStackTraceString());
        return retMap;
    }
}
