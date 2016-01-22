[![Build Status](https://travis-ci.org/uw-it-aca/scout.svg?branch=develop)](https://travis-ci.org/uw-it-aca/scout)  [![Coverage Status](https://coveralls.io/repos/uw-it-aca/scout/badge.svg?branch=master&service=github)](https://coveralls.io/github/uw-it-aca/scout?branch=master)
SCOUT
=====

This README documents whatever steps are necessary to get your application up and running using Vagrant or manually using our Classic Django environment.

## Vagrant ##

The Scout project uses Vagrant and Ansible to build your development environment. Go to the scout-vagrant github repo for instructions on installation.

https://github.com/uw-it-aca/scout-vagrant


## API ##

Refer to the Spotseeker API https://github.com/uw-it-aca/spotseeker_server/wiki/REST-protocol-v1 to view documentation regarding core data that is needed for all spots.


The following types are to be used for Food finding...

    "type" : ["cafe", "food_court", "cafeteria", "market", "fine_dining", "food_truck"],


Scout specific extended info...

	"extended_info": {

		// global extended info

		"app_type" : "food",
		"campus" : "seattle",
		"hours_notes" : "",
		"access_notes" : "",

		// scout extended info

		"s_menu_url" : "",
		"s_website_url" : "",
		"s_contact_phone" : "",

		"s_has_alert" : false,
		"s_alert_notes" : "",

	    "s_has_reservation" : false,
		"s_reservation_notes" : "",

		"s_has_coupon" : "true",
		"s_coupon_expiration" : "datetime",
		"s_coupon_url" : "",
		
		// cuisine extended info
		
		"s_cuisine" : ["american", "bbq", "chinese", "hawaiian", "indian", "italian", "japanese", "korean", "mexican", "vietnamese", "light_lunch"]
		
		// food served extended info
		
		"s_food_served" : ["appetizers", "burgers", "entrees", "espresso", "pasta", "pizza", "salads", "sandwiches", "smoothies", "sushi", "tacos"]
		
		// payment extended info
		
		"s_payment" : ["cash", "visa", "mastercard", "husky", "dining"]
	},
