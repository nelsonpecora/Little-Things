Little-Things
=============

A simple webapp that displays tasks from Things (my todo list app) and allows me to send them to Little Printer.

## Here's how it works:

1. syncthings.scpt (an Applescript file) talks to Things and uploads the "Today" list to /upload
2. Node.js handles all the back-end stuff and dumps the data into MongoDB
3. There are endpoints for Little Printer to grab a "publication" (a printable version of the data)
4. There's an AngularJS-based webapp that grabs the data and displays it on the homepage, and has a button to push the latest to Little Printer

**NOTE:** The Little Printer publication prints on demand, rather than on a schedule. It makes use of a pretty new and not 100% stable push API, so watch out. Also, this is the first thing I've made with Node, MongoDB, AngularJS, *and* Applescript, so I probably messed something up somewhere.

## TO DO

* Rewrite the Node.js stuff in Express, since that's pretty much the standard now
* Abstract out some of the database lookups, so the front-end app and Little Printer endpoints are more DRY
* Add OAUTH to make everything secure and make my life easier (using the Passport module)
* Add "Print Now" button to the webapp
* Switch out Mongojs for Mongoose, since it's more widely supported
* Maybe do more work on the Applescript and make it more robust
