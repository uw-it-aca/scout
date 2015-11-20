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
		
		"app_type" : "food",
		
		"s_campus" : "seattle",
		
		"s_hours_notes" : "",
		"s_access_notes" : "",
		
		"s_menu_url" : "",
		"s_website_url" : "",
		
		"s_has_alert" : false,
		"s_alert_notes" : "",
		
	    "s_has_reservation" : false,
		"s_reservation_notes" : "",
		
		"s_has_coupon" : "true",
		"s_coupon_expiration" "datime",
		"s_coupon_url" : "",
		
	    "s_cuisine_american" : true,
		"s_cuisine_chinese" : false,
		"s_cuisine_hawaiian" : false,
		"s_cuisine_italian" : false,
		"s_cuisine_korean" : false,
		"s_cuisine_vietnamese" : false,
		"s_cuisine_indian" : false,
		"s_cuisine_japanese" : false,
		"s_cuisine_mexican" : false,
		"s_cuisine_bbq" : false,
		"s_cuisine_light_lunch" : false,
		
		"s_serves_burgers" : true,
		"s_serves_entrees" : true,
		"s_serves_salads" : false,
		"s_serves_appetizers" : true,
		"s_serves_pizza" : true,
		"s_serves_sandwiches" : true,
		"s_serves_espresso" : true,
		"s_serves_sushi" : true,
		"s_serves_smoothies" : true,
		"s_serves_pasta" : true,
		"s_serves_tacos" : true,

		"s_payment_cash" : true,
		"s_payment_visa" : true,
		"s_payment_mastercard" : true,
		"s_payment_husky" : true,
		"s_payment_dining" : true,
		
		"s_open_breakfast" : true,
		"s_open_lunch" : true,
		"s_open_dinner" : true,
		"s_open_late_night" : false,
	},

