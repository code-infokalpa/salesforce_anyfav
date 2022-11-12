@isTest
public with sharing class AnyFav_FavouriteItemsControllerTest {
    @TestSetup
    static void setupData(){
        List<Favourite__c> favsList = new List<Favourite__c>();
        favsList.add(new Favourite__c(Title__c = 'Test title 1', Favourite_URL__c = 'https://test11111111111111111.com', Tags__c = 'tag1,tag2,tag3'));
        favsList.add(new Favourite__c(Title__c = 'Test title 2', Favourite_URL__c = 'https://test1111111111112222.com', Tags__c = 'tag1,tag2,tag3'));
        favsList.add(new Favourite__c(Title__c = 'Test title 3', Favourite_URL__c = 'https://test1111113333333311.com', Tags__c = 'tag1,tag2,tag3'));
        favsList.add(new Favourite__c(Title__c = 'Test title 4', Favourite_URL__c = 'https://test144444444412222.com', Tags__c = 'tag1,tag2,tag3'));
        insert favsList;
    }

    @isTest
    public static void getFavouriteItemsTest(){
        Test.startTest();
        List<Object> lstFavs = AnyFav_FavouriteItemsController.getFavouriteItems();
        Test.stopTest();
        System.assertEquals(4, lstFavs.size());
    }

    @isTest
    public static void deleteItemTest(){
        Favourite__c favItem = [SELECT Id FROM Favourite__c WHERE Title__c = 'Test title 1' LIMIT 1];
        Test.startTest();
        Map<String,Object> response = AnyFav_FavouriteItemsController.deleteItem(favItem.Id);
        Test.stopTest();
        System.assertEquals(response.get('status'), 'success');
    }

    @isTest
    public static void saveFavItemTest(){
        String json = '{  "favItemTitle" : "Test URL 1",  "favItemURL" : "https://asadofjoasdfsdfadsf.com",  "favItemTags" : "tag1,tag2,tag3"  }';
        Test.startTest();
        AnyFav_FavouriteItemsController.saveFavItem(json);
        Test.stopTest();
        List<Favourite__c> lstFavs = [SELECT Id FROM Favourite__c];
        System.assertEquals(5, lstFavs.size());
    }

    @isTest
    public static void exceptionCaseTest(){
        String json = '{  "favItemTitle" : "Test URL 1", "favItemId" : "", "favItemURL" : "https://asadofjoasdfsdfadsf.com",  "favItemTags" : "tag1,tag2,tag3"  }';
        Test.startTest();
        Map<String, Object> response = AnyFav_FavouriteItemsController.saveFavItem(json);
        Test.stopTest();
        System.assertEquals(response.get('status'), 'error');
    }
}
