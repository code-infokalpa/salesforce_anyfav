# AnyFav - <span style="font-size:smaller;">LWC App to record any Salesforce URL as favourite </span>
AnyFav is LWC based application which can be launched from global quick action. You can add current page's URL to the list of your favourite URLs so that you can re-visit them any time in future. Specially useful for Setup pages, deep level child Records, frequent visits to test data.   

It supports tags against the URL for quick searching and categorizing.

## Adding URL to favourite list
Below example shows adding a setting page URL to favourite:-
![](/assets/add_favourite.gif)

## Searching and launching stored URL
![](/assets/searching_favourite_by_tag.gif)

if you want to search entry matching multiptle tags use '#'. Ex. #account,#home
## Edit and Delete stored URLs
![](/assets/edit_favourite_item.gif)

Similarly you can delete the item.

## Permission Sets
1) AnyFav_Access - Provides access to use AnyFav component.
2) AnyFav_Admin - Have view all access on Favourite object.

## Custom Metadata
<strong>AnyFav_Config</strong> - have where clause to configure query for getting favourite items from the object.
