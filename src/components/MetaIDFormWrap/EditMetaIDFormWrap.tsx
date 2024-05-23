/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingOverlay from 'react-loading-overlay-ts';
import { useState } from 'react';
import { useEffect } from 'react';

import { toast } from "react-toastify";
import { BtcConnector } from "@metaid/metaid/dist/core/connector/btc";
import { useAtom, useAtomValue } from "jotai";
import { globalFeeRateAtom, networkAtom, userInfoAtom } from "../../store/user";
import EditMetaIdInfoForm from "./EditMetaIdInfoForm";
import { useQueryClient } from "@tanstack/react-query";

export type MetaidUserInfo = {
  name: string;
  bio?: string;
  avatar?: string;
  feeRate?: number;
};

type Iprops = {
  btcConnector: BtcConnector;
};

const EditMetaIDFormWrap = ({ btcConnector }: Iprops) => {
	const globalFeeRate = useAtomValue(globalFeeRateAtom);

	const [isEditing, setIsEditing] = useState(false);
	const [userInfo, setUserInfo] = useAtom(userInfoAtom);
	const network = useAtomValue(networkAtom);
	const [userInfoStartValues, setUserInfoStartValues] = useState<MetaidUserInfo>({
		name: userInfo?.name ?? "",
		bio: userInfo?.bio ?? "",
		avatar: userInfo?.avatar ?? undefined,
	});

  useEffect(() => {
    setUserInfoStartValues({
      name: userInfo?.name ?? '',
      bio: userInfo?.bio ?? '',
      avatar: userInfo?.avatar ?? undefined,
    });
  }, [userInfo]);

  const queryClient = useQueryClient();
  console.log('userInfo', userInfo);
  const handleEditMetaID = async (userInfo: MetaidUserInfo) => {
    setIsEditing(true);

		const res = await btcConnector
			.updateUserInfo({ ...userInfo, feeRate: Number(globalFeeRate) })
			.catch((error) => {
				console.log("error", error);
				const errorMessage = (error as any)?.message;
				const toastMessage = errorMessage.includes("Cannot read properties of undefined")
					? "User Canceled"
					: errorMessage;
				toast.error(toastMessage, {
					className: "!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg",
				});
				setIsEditing(false);
				setUserInfoStartValues(userInfoStartValues);
				//   console.log('error get user', await btcConnector.getUser());
				//   setUserInfo(await btcConnector.getUser());
			});
		console.log("update res", res);
		if (res) {
			console.log("after create", await btcConnector.getUser({ network }));
			setUserInfo(await btcConnector.getUser({ network }));
			setIsEditing(false);
			queryClient.invalidateQueries({ queryKey: ["userInfo"] });
			toast.success("Updating Your Profile Successfully!");
		}

    setIsEditing(false);
    const doc_modal = document.getElementById(
      'edit_metaid_modal'
    ) as HTMLDialogElement;
    doc_modal.close();
  };

  return (
    <LoadingOverlay active={isEditing} spinner text='Updating profile...'>
      <EditMetaIdInfoForm
        onSubmit={handleEditMetaID}
        initialValues={userInfoStartValues}
      />
    </LoadingOverlay>
  );
};

export default EditMetaIDFormWrap;
