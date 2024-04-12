import { useAtomValue } from "jotai";
import ProtocolList from "../components/ProtocolList";
import { initStillPoolAtom, userInfoAtom } from "../store/user";

const Home = () => {
	const userInfo = useAtomValue(userInfoAtom);

	const stillPool = useAtomValue(initStillPoolAtom); //
	return (
		<main className="relative">
			{/* <RecommendUsers /> */}
			{stillPool && (
				<div className="absolute text-[13px] top-[-20px] text-main">
					<div>
						Your MetaID TX hasn't been confirmed yet. You can start using the platform
						once your MetaID TX is confirmed.
					</div>
					<div
						className="cursor-pointer underline"
						onClick={() => {
							window.open(
								`https://mempool.space/zh/testnet/tx/${userInfo?.rootTxId ?? ""}`,
								"_blank"
							);
						}}
					>
						View TX.
					</div>
				</div>
			)}
			<ProtocolList />
		</main>
	);
};

export default Home;
