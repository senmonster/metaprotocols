/* eslint-disable @typescript-eslint/no-explicit-any */
// import FollowButton from "../Buttons/FollowButton";
import { Expand, Heart, Link as LucideLink } from "lucide-react";
// import { MessageCircle, Send, } from "lucide-react";
import { isEmpty, isNil } from "ramda";
import cls from "classnames";
import dayjs from "dayjs";
import { Pin } from ".";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPinDetailByPid } from "../../api/pin";
import { btcConnectorAtom, userInfoAtom } from "../../store/user";
import { useAtomValue } from "jotai";
import CustomAvatar from "../CustomAvatar";
// import { sleep } from '../../utils/time';
import { toast } from "react-toastify";
import { fetchCurrentProtocolLikes } from "../../api/protocol";
import { checkMetaidInit } from "../../utils/wallet";
import { temp_protocol } from "../../utils/mockData";
import "./styles.css";
type IProps = {
	protocolItem: Pin | undefined;
	onProtocolDetail?: (pinId: string) => void;
};

const ProtocolCard = ({ protocolItem, onProtocolDetail }: IProps) => {
	const btcConnector = useAtomValue(btcConnectorAtom);
	const userInfo = useAtomValue(userInfoAtom);
	const queryClient = useQueryClient();

	const summary = protocolItem!.contentSummary;
	const isSummaryJson = summary.startsWith("{") && summary.endsWith("}");
	const parseSummary = isSummaryJson ? JSON.parse(summary) : {};

	const attachPids = isSummaryJson
		? (parseSummary?.attachments ?? []).map((d: string) => d.split("metafile://")[1])
		: [];

	const { data: currentLikeData } = useQuery({
		queryKey: ["payLike", protocolItem!.id],
		queryFn: () => fetchCurrentProtocolLikes(protocolItem!.id),
	});
	const isLikeByCurrentUser = (currentLikeData ?? []).find(
		(d) => d.pinAddress === btcConnector?.address
	);

	const currentUserInfoData = useQuery({
		queryKey: ["userInfo", protocolItem!.address],
		queryFn: () => btcConnector?.getUser(protocolItem!.address),
	});

	const attachData = useQueries({
		queries: (attachPids ?? []).map((id: string) => {
			return {
				queryKey: ["post", id],
				queryFn: () => getPinDetailByPid({ pid: id }),
			};
		}),
		combine: (results: any) => {
			return {
				data: results.map((result: any) => result.data),
				pending: results.some((result: any) => result.isPending),
			};
		},
	});

	const handleLike = async (pinId: string) => {
		await checkMetaidInit(userInfo!);
		if (isLikeByCurrentUser) {
			toast.warn("You have already liked that protocol...");
			return;
		}

		const likeEntity = await btcConnector!.use("like");
		try {
			const likeRes = await likeEntity.create({
				options: [
					{
						body: JSON.stringify({ isLike: "1", likeTo: pinId }),
					},
				],
				noBroadcast: "no",
			});
			console.log("likeRes", likeRes);
			if (!isNil(likeRes?.revealTxIds[0])) {
				queryClient.invalidateQueries({ queryKey: ["metaprotocols"] });
				queryClient.invalidateQueries({ queryKey: ["payLike", protocolItem!.id] });
				// await sleep(5000);
				toast.success("like protocol successfully");
			}
		} catch (error) {
			console.log("error", error);
			const errorMessage = (error as any)?.message;
			const toastMessage = errorMessage.includes("Cannot read properties of undefined")
				? "User Canceled"
				: errorMessage;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			toast.warn(toastMessage);
		}
	};

	if (isNil(protocolItem)) {
		return <div>can't fetch this protocol</div>;
	}

	return (
		<>
			<div className="card">
				<div className="card-content gap-4 justify-between">
					<Expand
						onClick={() => onProtocolDetail && onProtocolDetail(protocolItem.id)}
						color="#929090"
						className=" absolute right-5 top-5 hover:scale-[1.30] duration-1000"
					/>

					<div className="flex flex-col gap-1">
						<div className="font-mono">{parseSummary.protocolTitle}</div>
						<div className="flex gap-2 items-center">
							{parseSummary.tags.map((d: string) => {
								return (
									<div className="hover:bg-slate-600	 text-xs font-thin text-slate-50/30 border border-slate-50/10 rounded-full px-2 pt-0.5 pb-1  text-center">
										{d}
									</div>
								);
							})}
						</div>
					</div>
					<div className="text-sm">
						{parseSummary.protocolIntroduction.split(".")[0] + "..."}
					</div>

					<div className="flex justify-between items-center">
						<div className="flex gap-2 items-center">
							{isNil(currentUserInfoData.data) ? (
								<div className="avatar placeholder">
									<div className="bg-[#2B3440] text-[#D7DDE4] rounded-full w-10">
										<span>{protocolItem!.address.slice(-4, -2)}</span>
									</div>
								</div>
							) : (
								<CustomAvatar size={10} userInfo={currentUserInfoData.data} />
							)}
							<div className="text-gray">
								{isNil(currentUserInfoData?.data?.name) ||
								isEmpty(currentUserInfoData?.data?.name)
									? "metaid-user-" + protocolItem.address.slice(-4)
									: currentUserInfoData?.data?.name}
							</div>
						</div>
						<div className="flex gap-2">
							<Heart
								className={cls(
									{ "text-[red]": isLikeByCurrentUser },
									"text-slate-50/50 hover:scale-[1.3] duration-1000"
								)}
								fill={isLikeByCurrentUser && "red"}
								onClick={() => handleLike(protocolItem!.id)}
							/>
							{!isNil(currentLikeData) ? currentLikeData.length : null}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProtocolCard;
