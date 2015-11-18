SCOUT
=====

This README documents whatever steps are necessary to get your application up and running using Vagrant or manually using our Classic Django environment.

## Vagrant ##

The Scout project uses Vagrant and Ansible to build your development environment. Go to the scout-vagrant github repo for instructions on installation.

https://github.com/uw-it-aca/scout-vagrant

    
## API ##

Refer to the Spotseeker API https://github.com/uw-it-aca/spotseeker_server/wiki/REST-protocol-v1


The following types are to be used for Food finding...

    "type": ["cafe", “espresso”, "market", "restaurant", "food_truck"],

This meta type is needed...

    "meta_type": ["food"],

Extended Info
    
	 "extended_info": {
		 	"available_hours"
		 	:
		 	:
		    “cuisine” : [[“american”, “bbq”]],
			“food_served” : [[“burgers”, “salads”, “appetizers”, “pizza”]],
			“menu_url” : “”,
			“website_url” : “”,
			“has_delivery” : true,
			“payment_accepted” : [[“cash”, “visa”, “mastercard”, “husky_card”, “dining_account”]],
			“open_period” : [[“breakfast”, “lunch”, “dinner”, “late_night”]],
	    },

