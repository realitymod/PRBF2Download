# PR:BF2 Download Assistant

A webapplication build on Electron to help facilitate the download and installation of Project Reality: Battlefield 2. 
Uses BitTorrent as download protocol using WebTorrent library.

## Functionality
* Allow user to select download folder and save this configuration when program is later restarted.
* Retrieve PR:BF2 version and torrent information from online source.
* Download of the installer torrent. 
* If operating system allows this(Win8 and above), it automatically mounts the installer to a virtual drive and starts the installer setup executable. Otherwise simply opens the download folder. 


## Start

Run `npm start` to start the application. 

## Build

Run `npm run dist` to build the project.
