import axios from 'axios';
import { Pin } from '../components/ProtocolList';
import { BtcNetwork } from './request';
import { environment } from '../utils/environments';
import { IBtcEntity } from '@metaid/metaid';
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
  network,
}: {
  protocolEntity: IBtcEntity;
  page: number;
  limit: number;
  network: BtcNetwork;
}): Promise<Pin[] | null> {
  console.log('fetcing');
  const response = await protocolEntity.list({ page, limit, network });
  return response;
}

export async function fetchCurrentProtocolLikes({
  pinId,
}: {
  pinId: string;
  network: BtcNetwork;
}): Promise<LikeRes[] | null> {
  const body = {
    collection: 'paylike',
    action: 'get',
    filterRelation: 'and',
    field: [],
    filter: [
      {
        operator: '=',
        key: 'likeTo',
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
      .post(`${environment.base_man_url}/api/generalQuery`, body)
      .then((res) => res.data);
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getPinDetailByPid({
  pid,
}: {
  pid: string;
  network: BtcNetwork;
}): Promise<Pin | null> {
  const url = `${environment.base_man_url}/api/pin/${pid}`;

  try {
    const data = await axios.get(url).then((res) => res.data);
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
