export type FeeRateApi = {
	fastestFee: number;
	halfHourFee: number;
	hourFee: number;
	economyFee: number;
	minimumFee: number;
};

export async function fetchFeeRate({
	netWork,
}: {
	netWork?: "testnet" | "mainnet";
}): Promise<FeeRateApi> {
	const response = await fetch(
		`https://mempool.space/${netWork === "mainnet" ? "" : "testnet"}/api/v1/fees/recommended`,
		{
			method: "get",
		}
	);
	return response.json();
}
