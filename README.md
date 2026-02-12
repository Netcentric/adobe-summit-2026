# Adobe Summit 2026

Repository for Cognizant Moment's (Netcentric's) Adobe Summit 2026 applications. 

This is an EDS repository not created from the boilerplate as we will use it mainly for static hosting.

. https://main--adobe-summit-2026--netcentric.aem.page/
- https://main--adobe-summit-2026--netcentric.aem.live/

- https://da.live/edit#/netcentric/adobe-summit-2026

# PROJECT STRUCTURE
## Apps 
The source code for the respective apps is located in `./src/[app-name]`. Pushing to the main branch will trigger a workflow that builds the application artifacts, copies them to `./[app-name]` and commits these files in order to trigger the aem deployment via github.
