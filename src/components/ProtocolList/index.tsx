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
import { networkAtom, userInfoAtom, walletAtom } from "../../store/user";
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
	const network = useAtomValue(networkAtom);
	const setUserInfo = useSetAtom(userInfoAtom);
	const _wallet = useAtomValue(walletAtom);

	const protocolEntity = useAtomValue(protocolEntityAtom);
	const getTotal = async (buzzEntity: BtcEntity) => {
		setTotal(await buzzEntity?.total({ network }));
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
				network,
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
		const _btcConnector: BtcConnector = await btcConnect({
			network,
			wallet: _wallet ?? undefined,
		});
		const _user = await _btcConnector.getUser({ network });

		setUserInfo(_user);
	};

	return (
		<>
			<div className="flex gap-2 items-center place-content-center mt-0 relative pt-4">
				<img src="/home-info.png" className="w-[600px] h-[90px]" />
				{!isRefetching ? (
					// <RotateCw
					// 	className="text-gray-500 absolute left-0 cursor-pointer"
					// 	onClick={handleRefresh}
					// />
					<div
						className="absolute left-0 tooltip tooltip-top tooltip-primary"
						data-tip="Click to refetch new data."
					>
						<button
							className="btn btn-sm btn-ghost text-gray-400 hover:bg-gray-700 bg-gray-900 hover:border-none"
							onClick={handleRefresh}
						>
							refetch
						</button>
					</div>
				) : (
					<div className="btn btn-ghost absolute left-2 text-gray-500">
						refetching
						<div className="loading loading-dots text-sm "></div>
					</div>
				)}
			</div>

			{isLoading ? (
				<div className="flex items-center gap-2 justify-center h-[500px]">
					<div>Protocol Feed is Coming</div>
					<span className="loading loading-bars loading-md grid text-white"></span>
				</div>
			) : (
				<>
					<div
						// id="cards"
						className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-8 mt-12"
					>
						{protocoles}
					</div>
					<div className="grid place-content-end mt-8">
						<button
							ref={ref}
							className="rounded-lg p-2.5 px-4"
							onClick={() => fetchNextPage()}
							disabled={!hasNextPage || isFetchingNextPage}
						>
							{hasNextPage && isFetchingNextPage ? (
								<div className="flex items-center gap-1 cursor-pointer text-white/90">
									<div>More</div>
									<span className="loading loading-dots loading-md grid"></span>
								</div>
							) : (
								<div
									className="tooltip tooltip-left tooltip-primary"
									data-tip="Nothing More To Load."
								>
									<div className="text-white/50 cursor-not-allowed">More</div>
								</div>
							)}
						</button>
					</div>
				</>
			)}
		</>
	);
};

export default ProtocolList;
