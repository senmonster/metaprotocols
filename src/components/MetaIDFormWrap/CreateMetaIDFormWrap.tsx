/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingOverlay from "react-loading-overlay-ts";
import { useState } from "react";

import { toast } from "react-toastify";
import { BtcConnector } from "@metaid/metaid/dist/core/connector/btc";
import CreateMetaIdInfoForm from "./CreateMetaIdInfoForm";
import { useAtomValue } from "jotai";
import { globalFeeRateAtom, walletAtom } from "../../store/user";
import { isNil } from "ramda";

export type MetaidUserInfo = {
	name: string;
	bio?: string;
	avatar?: string;
	feeRate?: number;
};

const CreateMetaIDFormWrap = ({
	btcConnector,
	onWalletConnectStart,
}: {
	btcConnector: BtcConnector;
	onWalletConnectStart: () => void;
}) => {
	const globalFeeRate = useAtomValue(globalFeeRateAtom);

	const [isCreating, setIsCreating] = useState(false);
	const wallet = useAtomValue(walletAtom);
	const handleCreateMetaID = async (userInfo: MetaidUserInfo) => {
		console.log("userInfo", userInfo);
		console.log(
			"wallet balance",

			await wallet?.getBalance()
		);
		setIsCreating(true);

		const res = await btcConnector
			.createMetaid({ ...userInfo, feeRate: Number(globalFeeRate) })
			.catch((error: any) => {
				setIsCreating(false);
				console.log("create metaid error ", "message", TypeError(error).message);
				const errorMessage = TypeError(error).message;

				const toastMessage = errorMessage.includes("Cannot read properties of undefined")
					? "User Canceled"
					: errorMessage;
				toast.error(toastMessage, {
					className: "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
				});
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			});

		if (isNil(res?.metaid)) {
			toast.error("Create Failed", {
				className: "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
			});
		} else {
			toast.success("Successfully created!Now you can connect your wallet again!");
		}

		setIsCreating(false);
		console.log("your metaid", btcConnector.metaid);
		const doc_modal = document.getElementById("create_metaid_modal") as HTMLDialogElement;
		doc_modal.close();
		await onWalletConnectStart();
	};

	return (
		<LoadingOverlay active={isCreating} spinner text="Creating MetaID...">
			<CreateMetaIdInfoForm onSubmit={handleCreateMetaID} />
		</LoadingOverlay>
	);
};

export default CreateMetaIDFormWrap;
