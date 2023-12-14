import { Runtime, runtime } from 'webextension-polyfill';

class Background {
    startup = () => {
        console.log('Background Page of this wonderful extension');
    };

    constructor() {
        runtime.onInstalled.addListener((details: Runtime.OnInstalledDetailsType) => {
            if (details.reason === 'install') {
                console.log('Install Complete');
            }
        });
        this.startup();
    }
}

export const background = new Background();
