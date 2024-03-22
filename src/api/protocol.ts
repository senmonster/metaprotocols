import axios from "axios";
import { type BtcEntity } from "@metaid/metaid/dist/core/entity/btc";
import { Pin } from "../components/ProtocolList";
// export async function fetchProtocols(page: number): Promise<ProtocolItem[]> {
// 	const response = await axios.get(
// 		`http://localhost:3000/protocoles?_page=${page}&_limit=5&_sort=createTime&_order=desc`
// 	);
// 	return response.data;
// }

export type LikeRes = {
	_id: string;
	isLike: string;
	likeTo: string;
	pinAddress: string;
	pinId: string;
	pinNumber: number;
};

export async function fetchProtocols({
	protocolEntity,
	page,
	limit,
}: {
	protocolEntity: BtcEntity;
	page: number;
	limit: number;
}): Promise<Pin[] | null> {
	console.log("fetcing");
	const response = await protocolEntity.getPins({ page, limit });
	return response;
}

export async function fetchCurrentProtocolLikes(pinId: string): Promise<LikeRes[] | null> {
	const body = {
		collection: "paylike",
		action: "get",
		filterRelation: "and",
		field: [],
		filter: [
			{
				operator: "=",
				key: "likeTo",
				value: pinId,
			},
		],
		cursor: 0,
		limit: 99999,
		sort: [],
	};

	// const response = await fetch(`https://man-test.metaid.io/api/btc/generalQuery`, {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify(body),
	// });
	// return response.json();

	try {
		const data = await axios
			.post(`https://man-test.metaid.io/api/btc/generalQuery`, body)
			.then((res) => res.data);
		return data.data;
	} catch (error) {
		console.error(error);
		return null;
	}
}
