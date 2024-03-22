import { type BtcEntity } from "@metaid/metaid/dist/core/entity/btc";
import { atom } from "jotai";
// import { Pin } from '../components/ProtocolList';

export const protocolEntityAtom = atom<BtcEntity | null>(null);
// export const protocolPinsAtom = atom<Pin[] | []>([]);
