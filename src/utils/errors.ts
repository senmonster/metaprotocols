import { environment } from './environments';

export const errors = {
  NO_METALET_DETECTED:
    'It appears that you do not have Metalet Wallet Extentsion installed or have not created a wallet account.',
  NO_WALLET_CONNECTED: 'Please connect your wallet first...',
  NO_METALET_LOGIN: 'Please log in your Metalet Account first...',
  SWITCH_NETWORK_ALERT: `Please switch to the ${
    environment.network.charAt(0).toUpperCase() + environment.network.slice(1)
  } to go on.`,
};
