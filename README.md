places-website
==============

The web server for the places-api project

This project allows the use of the places-api express.js middleware.
The Places API itself is built as middleware for a container application.
The places-website project can serve as that container.

It also contains some templated pages for viewing information directly from the places-api.

Deploying
---------
The places server currently runs two instances of the places-api
* places-website: This is the production places system, it can be started using the command `sudo start places-website`. It uses the `places_api` and `places_pgs` databases
* * places-website-test: This is the test places system, it can be started using the command `sudo start places-website-test`. It uses the `test_places_api` and `test_places_pgs` databases.

There are also the `dev_places_api` and `dev_places_api` databases. These are used for the development system only.

To check the status of these services, you can run the `sudo forever list` command.
