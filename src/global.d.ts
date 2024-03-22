/* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
	removeEventListener: any;
	metaidwallet: {
		on: any;
		removeListener: any;
		getXPublicKey: () => Promise<string>;
		connect: () => Promise<{ address: string }>;
		disconnect: () => Promise<void>;
		getNetwork: () => Promise<{ network: string }>;
		btc: {
			signPsbt: ({ psbtHex: string, options: any }) => Promise<string>;
			signMessage: (msg: string) => Promise<string>;
			connect: () => Promise<{ address: string; pubKey: string }>;
			getPublicKey: () => Promise<string>;
			getAddress: () => Promise<string>;
			getBalance: () => Promise<{
				address: string;
				total: number;
				confirmed: number;
				unconfirmed: number;
			}>;
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
