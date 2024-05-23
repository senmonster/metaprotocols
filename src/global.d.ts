import { BtcNetwork } from "./api/request";

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
	interface Window {
		removeEventListener: any;
		metaidwallet: {
			on: any;
			removeListener: any;
			getXPublicKey: () => Promise<string>;
			connect: () => Promise<{ address: string; status?: string }>;
			disconnect: () => Promise<void>;
			getNetwork: () => Promise<{ network: BtcNetwork }>;
			switchNetwork: ({
				network,
			}: {
				network: BtcNetwork;
			}) => Promise<{ status: string; network: BtcNetwork; address: string }>;
			btc: {
				signPsbt: ({ psbtHex: string, options: any }) => Promise<string>;
				signMessage: (msg: string) => Promise<string>;
				connect: () => Promise<{
					address: string;
					pubKey: string;
					status?: string;
				}>;
				getPublicKey: () => Promise<string>;
				getAddress: () => Promise<string>;
				getBalance: () => Promise<{
					address: string;
					total: number;
					confirmed: number;
					unconfirmed: number;
				}>;
				inscribe: ({
					data,
					options,
				}: {
					data: any;
					options?: { noBroadcast: boolean };
				}) => Promise<any>;
				process: ({
					data,
					options,
				}: {
					data: any;
					options?: { noBroadcast: boolean };
				}) => Promise<any>;
			};
		};
	}
}
