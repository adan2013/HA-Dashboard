# Home Assistant Dashboard

This project is a custom dashboard website for my Home Assistant smart home system. It is designed to work on wall-mounted tablet and [Fully Kiosk Browser app](https://play.google.com/store/apps/details?id=de.ozerov.fully).

**Why I am not using the standard Lovelace UI?**
I am not a big fan of Material Design and I wanted to create something more specialized. I also wanted to have more control over the layout and the way the tiles are displayed. I also wanted to have a possibility to create custom tiles for my specific smart home devices.

**Can I use this for my own HomeAssistant instance?**
Sure! Feel free to fork this repository and modify it to your needs. Change the environment variables and create your own sections with tiles adjusted to your smart home configuration.

**Do I need only a Home Assistant instance?**
No, except the Home Assistant, my implementation uses an external Node.js backend for the weather, real-time notifications etc. Of course, you can remove the backend if you like, but it requires a few changes in the code. The repository for the Node.js backend can be found [here](https://github.com/adan2013/HA-Backend).

## Future plans

- [ ] Publicly hosted demo
- [ ] PWA support
- [ ] Documentation for created tiles
- [ ] Dependency Injection for tiles
- [ ] Cover websocket connection with tests
- [ ] Security alarm

## Getting Started

1. Fork and clone the repository
2. Install dependencies
    ```bash
    yarn install
    ```
 3. Create `.env` file and add the environment variables
    ```
    VITE_HA_HOST=ip_address:8123
    VITE_HA_TOKEN=ha_access_token
    ```
4. Start the development server
    ```bash
    yarn dev
    ```

## Other commands

```
yarn build         - build for production
yarn test          - run tests
yarn coverage      - generate test coverage report
yarn coverage-full - generate test coverage report for all files
yarn docker-build  - build docker image
yarn docker-run    - run docker image
```

## Built with

- Vite
- React
- TypeScript
- TailwindCSS + clsx
- Material UI Icons
- recharts
- react-toastify
- react-modal
- Jest + React Testing Library
- ESlint + Prettier
