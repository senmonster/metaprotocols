import { IMetaletWalletForBtc, type IBtcConnector } from '@metaid/metaid';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type UserInfo = {
  number: number;
  rootTxId: string;
  name: string;
  address: string;
  avatar: string | null;
  bio: string;
  soulbondToken: string;
  unconfirmed: string;
  metaid: string;
};

export const connectedAtom = atomWithStorage<boolean>('connectedAtom', false);
export const btcConnectorAtom = atom<IBtcConnector | null>(null);
export const userInfoAtom = atom<UserInfo | null>(null);

export const walletAtom = atom<IMetaletWalletForBtc | null>(null);
// export const userInfoAtom = atom<UserInfo | null>(null);
/**
 * unisat account stuff
 */
export const unisatInstalledAtom = atom(false);
export const accountsAtom = atom<string[]>([]);
export const publicKeyAtom = atom('');
export const addressAtom = atom('');
export const balanceAtom = atom({
  confirmed: 0,
  unconfirmed: 0,
  total: 0,
});

export const globalFeeRateAtom = atom<string>('20');

export const walletRestoreParamsAtom = atomWithStorage<
  | {
      address: string;
      pub: string;
    }
  | undefined
>('walletRestoreParamsAtom', undefined);
