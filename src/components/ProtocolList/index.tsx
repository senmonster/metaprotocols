import { RotateCw, Sparkle } from "lucide-react";
import { useEffect, useState } from "react";
import ProtocolCard from "./ProtocolCard";
import { fetchProtocols } from "../../api/protocol";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useAtomValue, useSetAtom } from "jotai";
import { protocolEntityAtom } from "../../store/protocol";
import { isNil } from "ramda";
import { BtcEntity } from "@metaid/metaid/dist/core/entity/btc";
import { btcConnect } from "@metaid/metaid";
import { BtcConnector } from "@metaid/metaid/dist/core/connector/btc";
import { userInfoAtom, walletAtom } from "../../store/user";
// import './styles.css';
export type Pin = {
	id: string;
	number: number;
	rootTxId: string;
	address: string;
	output: string;
	outputValue: number;
	timestamp: number;
	genesisFee: number;
	genesisHeight: number;
	genesisTransaction: string;
	txInIndex: number;
	txInOffset: number;
	operation: string;
	path: string;
	parentPath: string;
	encryption: string;
	version: string;
	contentType: string;
	contentBody: string;
	contentLength: number;
	contentSummary: string;
};

const ProtocolList = () => {
	const { ref, inView } = useInView();
	const [total, setTotal] = useState<null | number>(null);
	const setUserInfo = useSetAtom(userInfoAtom);
	const _wallet = useAtomValue(walletAtom);

	const protocolEntity = useAtomValue(protocolEntityAtom);
	const getTotal = async (buzzEntity: BtcEntity) => {
		setTotal(await buzzEntity?.calcPins());
	};

	const {
		data,
		isLoading,
		isRefetching,
		refetch,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: ["metaprotocols"],
		enabled: !isNil(protocolEntity),

		queryFn: ({ pageParam }) =>
			fetchProtocols({
				page: pageParam,
				limit: 5,
				protocolEntity: protocolEntity!,
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const nextPage = lastPage?.length ? allPages.length + 1 : undefined;
			if (allPages.length * 5 >= (total ?? 0)) {
				return;
			}
			return nextPage;
		},
	});

	useEffect(() => {
		if (!isNil(protocolEntity)) {
			getTotal(protocolEntity!);
		}
	}, [protocolEntity]);

	useEffect(() => {
		if (inView && hasNextPage) {
			console.log("Fire!");
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	const protocoles = data?.pages.map((pins: Pin[] | null) =>
		(pins ?? []).map((pin) => {
			return <ProtocolCard key={pin.id} protocolItem={pin} />;
		})
	);
	useEffect(() => {
		const ele = document.getElementById("cards");
		if (!isNil(ele)) {
			ele.onmousemove = (e) => {
				for (const card of document.getElementsByClassName("card")) {
					const rect = card.getBoundingClientRect(),
						x = e.clientX - rect.left,
						y = e.clientY - rect.top;

					(card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
					(card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
				}
			};
		}
	});

	const handleRefresh = async () => {
		refetch();
		// const _wallet = await MetaletWalletForBtc.create();
		const _btcConnector: BtcConnector = await btcConnect(_wallet ?? undefined);
		const _user = await _btcConnector.getUser();

		setUserInfo(_user);
	};

	return (
		<div>
			<div className="flex gap-2 items-center place-content-center mt-0">
				<Sparkle className="text-main" />
				<div className="text-white text-[36px] font-['Impact']">
					{"Build Dapp With MetaProtocols"}
				</div>
				{!isRefetching ? (
					<RotateCw
						className="text-gray-500 absolute right-0 cursor-pointer"
						onClick={handleRefresh}
					/>
				) : (
					<div className="loading loading-dots absolute right-0 text-gray text-sm "></div>
				)}
				<Sparkle className="text-main" />
			</div>

			{isLoading ? (
				<div className="flex items-center gap-2 justify-center h-[200px]">
					<div>Protocol Feed is Coming</div>
					<span className="loading loading-bars loading-md grid text-white"></span>
				</div>
			) : (
				<>
					<div
						id="cards"
						className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-5 gap-3 mt-6"
					>
						{protocoles}
					</div>
					<button
						ref={ref}
						className="btn w-full mt-6"
						onClick={() => fetchNextPage()}
						disabled={!hasNextPage || isFetchingNextPage}
					>
						{hasNextPage && isFetchingNextPage ? (
							<div className="flex items-center gap-1">
								<div>Loading more</div>
								<span className="loading loading-dots loading-md grid text-white"></span>
							</div>
						) : (
							<div>Nothing more to load </div>
						)}
					</button>
				</>
			)}
		</div>
	);
};

export default ProtocolList;
