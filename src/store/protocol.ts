import { type IBtcEntity } from '@metaid/metaid';
import { atom } from 'jotai';
// import { Pin } from '../components/ProtocolList';

export const protocolEntityAtom = atom<IBtcEntity | null>(null);
// export const protocolPinsAtom = atom<Pin[] | []>([]);
