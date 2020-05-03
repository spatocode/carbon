<img src="https://github.com/carbonplayer/carbon/blob/master/icons/logo.png" width='300px' />

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/da45438e966d43b58bca3c447b61c040)](https://app.codacy.com/gh/carbonplayer/carbon?utm_source=github.com&utm_medium=referral&utm_content=carbonplayer/carbon&utm_campaign=Badge_Grade_Dashboard) ![version](https://img.shields.io/github/package-json/v/carbonplayer/carbon) [![License: GPL-2.0](https://img.shields.io/github/license/carbonplayer/carbon)](https://opensource.org/licenses/GPL-2.0) ![issues](https://img.shields.io/github/issues/carbonplayer/carbon)

Beautiful and elegant desktop media player

<img src="https://github.com/carbonplayer/carbon/blob/master/icons/carbon_preview_1.png" />

## Features
* Listening from local library
* Opening and playing single audio file
* Display media metadata
* Shuffle songs
* Repeat songs
* Playing selected favourite songs
* Playing selected playists
* Search song by name
* Media keys shortcut (play, previous, next)
* Open and stream songs over the network via a URL

<img src="https://github.com/carbonplayer/carbon/blob/master/icons/carbon_preview_2.png" />

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
