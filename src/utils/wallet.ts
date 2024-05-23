import { toast } from 'react-toastify';
import { errors } from './errors';

export const checkMetaletInstalled = async () => {
  const metalet = window?.metaidwallet;
  // const connectRes = await metalet?.connect();
  if (typeof metalet === 'undefined') {
    const doc_modal = document.getElementById(
      'alert_install_metalet_modal'
    ) as HTMLDialogElement;
    doc_modal.showModal();
    // toast.error(errors.NO_METALET_DETECTED, {
    //   className:
    //     '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
    // });
    throw new Error(errors.NO_METALET_DETECTED);
  }
};

export const conirmMetaletTestnet = async () => {
  const metalet = window?.metaidwallet;
  const network = await metalet?.getNetwork();
  if (network?.network !== 'testnet') {
    toast.error(errors.SWITCH_TESTNET_ALERT, {
      className:
        '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
    });
    await window.metaidwallet.switchNetwork({ network: 'testnet' });

    throw new Error(errors.SWITCH_TESTNET_ALERT);
  }
};

export const confirmMetaletMainnet = async () => {
  const metalet = window?.metaidwallet;
  const network = await metalet?.getNetwork();
  if (network?.network !== 'mainnet') {
    toast.error(errors.SWITCH_MAINNET_ALERT, {
      className:
        '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
    });
    await window.metaidwallet.switchNetwork({ network: 'mainnet' });

    throw new Error(errors.SWITCH_MAINNET_ALERT);
  }
};

export const checkMetaletConnected = async (connected: boolean) => {
  if (!connected) {
    toast.error(errors.NO_WALLET_CONNECTED, {
      className:
        '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
    });
    throw new Error(errors.NO_WALLET_CONNECTED);
  }
};
