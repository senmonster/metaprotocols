import { Sparkle } from "lucide-react";
import { useEffect } from "react";
// import { useState } from "react";
// import cls from "classnames";
import ProtocolCard from "./ProtocolCard";
import { fetchProtocols } from "../../api/protocol";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useAtomValue } from "jotai";
import { protocolEntityAtom } from "../../store/protocol";
import { isNil } from "ramda";
// import { useCallback } from 'react';
// // import { ProtocolItem } from '../../types';
// import { useAtom } from 'jotai';
// import { btcConnectorAtom } from '../../store/user';
// import { protocolPinsAtom } from '../../store/protocol';
// import { isNil } from 'ramda';

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

// const ProtocolList = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [protocolPins, setProtocolPins] = useAtom(protocolPinsAtom);
//   const protocolEntity = useAtomValue(protocolEntityAtom);
//   const navigate = useNavigate();

//   const [showNewProtocol, setShowNewProtocol] = useState(true);

//   const fetchPins = useCallback(async () => {
//     setIsLoading(true);
//     await sleep(800);
//     if (!isNil(protocolEntity)) {
//       const _protocolPins = await protocolEntity!.getPins();
//       setProtocolPins(_protocolPins);
//       setIsLoading(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [protocolEntity]);

//   // the useEffect is only there to call `fetchData` at the right time
//   useEffect(() => {
//     fetchPins()
//       // make sure to catch any error
//       .catch(console.error);
//   }, [fetchPins]);

//   const protocoles = protocolPins.map((pin, index) => {
//     return (
//       <ProtocolCard
//         imgSeed={'seed' + index}
//         key={pin.id}
//         protocolItem={pin}
//         onProtocolDetail={(txid) => navigate(`/protocol/${txid}`)}
//       />
//     );
//   });

//   return (
//     <div>
//       <div className='flex gap-2 items-center place-content-center mt-16'>
//         <Sparkle className='text-main' />
//         <div className="text-white text-[36px] font-['Impact']">
//           {"What's New Today"}
//         </div>
//         <Sparkle className='text-main' />
//       </div>

//       <div className='text-white flex mx-auto border border-white w-fit rounded-full mt-8'>
//         <div
//           className={cls('btn w-[150px] h-[26px] cursor-pointer', {
//             'btn-primary rounded-full': !showNewProtocol,
//             'btn-outline border-none': showNewProtocol,
//           })}
//           onClick={() => setShowNewProtocol(false)}
//         >
//           Follow
//         </div>
//         <div
//           className={cls('btn w-[150px] h-[26px] cursor-pointer', {
//             'btn-primary rounded-full': showNewProtocol,
//             'btn-outline border-none': !showNewProtocol,
//           })}
//           onClick={() => setShowNewProtocol(true)}
//         >
//           New
//         </div>
//       </div>

//       {isLoading ? (
//         <div className='flex items-center gap-2 justify-center h-[200px]'>
//           <div>Protocol Feed is Coming</div>
//           <span className='loading loading-bars loading-md grid text-white'></span>
//         </div>
//       ) : (
//         <div className='flex flex-col gap-3 my-4'>{protocoles}</div>
//       )}
//     </div>
//   );
// };

// export default ProtocolList;

const ProtocolList = () => {
	const navigate = useNavigate();
	const { ref, inView } = useInView();

	const protocolEntity = useAtomValue(protocolEntityAtom);
	console.log("protocolEntity", !isNil(protocolEntity), protocolEntity);
	// const [showNewProtocol, setShowNewProtocol] = useState(true);

	const {
		data,
		isLoading,
		// isFetching,
		fetchNextPage,

		isFetchingNextPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: ["protocoles"],
		enabled: !isNil(protocolEntity),
		refetchOnMount: "always",
		refetchOnReconnect: "always",
		refetchOnWindowFocus: "always",
		queryFn: ({ pageParam }) =>
			fetchProtocols({ page: pageParam, limit: 5, protocolEntity: protocolEntity! }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const nextPage = lastPage?.length ? allPages.length + 1 : undefined;
			return nextPage;
		},
	});
	const protocoles = data?.pages.map((pins: Pin[] | null) =>
		(pins ?? []).map((pin) => {
			return (
				<ProtocolCard
					key={pin.id}
					protocolItem={pin}
					onProtocolDetail={(txid) => navigate(`/protocol/${txid}`)}
				/>
			);
		})
	);

	useEffect(() => {
		if (inView && hasNextPage) {
			console.log("Fire!");
			fetchNextPage();
		}
	}, [inView, hasNextPage, fetchNextPage]);

	return (
		<div>
			<div className="flex gap-2 items-center place-content-center mt-0">
				<Sparkle className="text-main" />
				<div className="text-white text-[36px] font-['Impact']">
					{"Build Dapp With MetaProtocols"}
				</div>
				<Sparkle className="text-main" />
			</div>

			{/* <div className="text-white flex mx-auto border border-white w-fit rounded-full mt-8">
				<div
					className={cls("btn w-[150px] h-[26px] cursor-pointer", {
						"btn-primary rounded-full": !showNewProtocol,
						"btn-outline border-none": showNewProtocol,
					})}
					onClick={() => setShowNewProtocol(false)}
				>
					Follow
				</div>
				<div
					className={cls("btn w-[150px] h-[26px] cursor-pointer", {
						"btn-primary rounded-full": showNewProtocol,
						"btn-outline border-none": !showNewProtocol,
					})}
					onClick={() => setShowNewProtocol(true)}
				>
					New
				</div>
			</div> */}

			{isLoading ? (
				<div className="flex items-center gap-2 justify-center h-[200px]">
					<div>Protocol Feed is Coming</div>
					<span className="loading loading-bars loading-md grid text-white"></span>
				</div>
			) : (
				<div className="flex flex-col gap-3 my-4">
					{protocoles}
					<button
						ref={ref}
						className="btn  "
						onClick={() => fetchNextPage()}
						disabled={!hasNextPage || isFetchingNextPage}
					>
						{hasNextPage && isFetchingNextPage ? (
							<div className="flex items-center gap-1">
								<div>Loading more</div>
								<span className="loading loading-dots loading-md grid text-white"></span>
							</div>
						) : (
							//  hasNextPage ? (
							//   <div className='bg-[black] flex items-center w-full'> Load Newer </div>
							// ) :
							<div className=" place-items-center">Nothing more to load </div>
						)}
					</button>
				</div>
			)}
		</div>
	);
};

export default ProtocolList;
