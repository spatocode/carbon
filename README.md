<img src="https://github.com/carbonplayer/carbon/blob/master/icons/logo.png" width='300px' />

![version](https://img.shields.io/github/package-json/v/carbonplayer/carbon) [![License: GPL-2.0](https://img.shields.io/github/license/carbonplayer/carbon)](https://opensource.org/licenses/GPL-2.0) ![issues](https://img.shields.io/github/issues/carbonplayer/carbon)

Beautiful and elegant desktop media player

[![Carbon Player Screenshot](https://github.com/carbonplayer/carbon/blob/master/icons/carbon_preview_1.png)]()

## Features
* Listening from local library
* Opening and playing single audio file
* Display media metadata
* Shuffle songs
* Repeat songs
* Playing selected favourite songs
* Playing selected playlists
* Search song by name
* Media keys shortcut (play, previous, next)
* Open and stream songs over the network via a URL

## Install

### Linux

```sh
sudo snap install carbon-player
```
[![Get it from the Snap Store](https://github.com/carbonplayer/carbon/blob/master/icons/snap.png)](https://snapcraft.io/carbon-player)

### Windows

[Windows installer x64](https://github.com/carbonplayer/carbon/releases/download/v1.1.0/Carbon_Player_Setup_1.1.0_x64.exe)

[Windows installer x86](https://github.com/carbonplayer/carbon/releases/download/v1.1.0/Carbon_Player_Setup_1.1.0_x86.exe)


[![Carbon Player Screenshot](https://github.com/carbonplayer/carbon/blob/master/icons/carbon_preview_2.png)]()

[![Carbon Player Screenshot](https://github.com/carbonplayer/carbon/blob/master/icons/carbon_preview_3.png)]()


## Build and Development process
Clone the repository and install dependencies

```bash
$ git clone https://github.com/carbonplayer/carbon.git
$ cd carbon
$ yarn install
```

This project uses react for it's UI, redux  for state management and electron for managing window and native OS capabilities. To build the react code, run

```$ npm run build```

This will compile a production version of the javascript react code used for electron renderer process. Similarly, you can also run react development version by running

```$ npm run renderer```

Then to start the electron process. Run
```$ npm start```

## Contributing
Looking to contribute?

Feel free to join the development of this project with code or ideas.
Contributions, issues and feature requests are welcome!

Please check out our [contributing guide](https://github.com/carbonplayer/carbon/blob/master/CONTRIBUTING.md) to get an overview of how to contribute to Carbon Player.

## LICENSE
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation.

[GPL License](https://github.com/carbonplayer/carbon/blob/master/LICENSE)
