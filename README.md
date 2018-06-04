# PR:BF2 Download Assistant

A simple webapplication build on Electron to help facilitate the download and installation of Project Reality: Battlefield 2. 
Uses BitTorrent as download protocol using WebTorrent library.

## Functionality
* Allow user to select download folder and save this configuration information.
* Retrieve PR:BF2 version and torrent information from online source.
* Download of the installer torrent.
* If operating system allows it automatically mounts the installer to virtual drive and starts setup executable. Otherwise opens download folder. 


## Start

Run `npm start` to start the application. 

## Build

Run `npm run dist` to build the project.
