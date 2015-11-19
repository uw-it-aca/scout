SCOUT
=====

This README documents whatever steps are necessary to get your application up and running using Vagrant or manually using our Classic Django environment.

## Vagrant ##

The Scout project uses Vagrant and Ansible to build your development environment. Go to the scout-vagrant github repo for instructions on installation.

https://github.com/uw-it-aca/scout-vagrant

    
## API ##

Refer to the Spotseeker API https://github.com/uw-it-aca/spotseeker_server/wiki/REST-protocol-v1 to view documentation regarding core data that is needed for all spots.


The following types are to be used for Food finding...

    "type": ["cafe", "cafeteria", "market", "restaurant", "food_truck"],

This meta type is needed...

    "meta_type": ["food"],

General extended info...
    
	 "extended_info": {
		 	"campus","seattle"
		 	"hours_notes", ""
		 	"access_notes", ""
	    },
	    
Scout specific extended info...
    
	 "extended_info": {
		    “cuisine” : [“american”, “bbq”, "chinese", "hawaiian", "itallian"],
			“food_served” : [“burgers”, “salads”, “appetizers”, “pizza”, "sandwiches", "coffee_espresso"],
			“menu_url” : “”,
			“website_url” : “”,
			“has_delivery” : true,
			“payment_accepted” : [“cash”, “visa”, “mastercard”, “husky_card”, “dining_account”],
			“open_period” : [“breakfast”, “lunch”, “dinner”, “late_night”],
	    },

