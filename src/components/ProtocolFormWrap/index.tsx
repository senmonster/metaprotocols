/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createProtocol } from '../api/protocol';
import ProtocolForm, { AttachmentItem, ProtocolFormData } from "./ProtocolForm";
// import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay-ts";
// import dayjs from 'dayjs';
import { protocolEntityAtom } from "../../store/protocol";
import { useAtomValue } from "jotai";
import { isEmpty, isNil } from "ramda";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { btcConnectorAtom } from "../../store/user";
import { sleep } from "../../utils/time";
import { CreateOptions } from "@metaid/metaid/dist/core/entity/btc";
import { SubmitHandler, useForm } from "react-hook-form";
import { image2Attach } from "../../utils/file";
import useImagesPreview from "../../hooks/useImagesPreview";
import { ProtocolItem } from "../../types";
import { createBrfcid } from "../../utils/crypto";
import { temp_protocol } from "../../utils/mockData";
const ProtocolFormWrap = () => {
	const protocolEntity = useAtomValue(protocolEntityAtom);
	const btcConnector = useAtomValue(btcConnectorAtom);

	const [isAdding, setIsAdding] = useState(false);
	const queryClient = useQueryClient();

	const protocolFormHandle = useForm<ProtocolFormData>();
	const files = protocolFormHandle.watch("protocolAttachments");
	const [filesPreview, setFilesPreview] = useImagesPreview(files);
	const onClearImageUploads = () => {
		setFilesPreview([]);
		protocolFormHandle.setValue("protocolAttachments", [] as any);
	};

	const onCreateSubmit: SubmitHandler<ProtocolFormData> = async (data) => {
		const protocolAttachments =
			data.protocolAttachments.length !== 0
				? await image2Attach(data.protocolAttachments)
				: [];

		await handleAddProtocol({
			...data,
			protocolAttachments,
		});
		console.log("data protocolAttachments", data.protocolAttachments);
	};

	const handleAddProtocol = async (
		protocol: Omit<ProtocolFormData, "protocolAttachments"> & {
			protocolAttachments: AttachmentItem[];
		}
	) => {
		setIsAdding(true);

		console.log("protocol data", temp_protocol);
		const protocolHASHID = createBrfcid({
			title: protocol.protocolTitle,
			author: protocol.protocolAuthor,
			version: protocol.protocolVersion,
		});
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const finalBody: ProtocolItem = {
				...temp_protocol,
				protocolHASHID,
				protocolAttachments: [],
				tags: ["meta", "protocols"],
				relatedProtocols: [],
			};
			if (!isEmpty(protocol.protocolAttachments)) {
				const fileOptions: CreateOptions[] = [];

				const fileEntity = await btcConnector!.use("file");

				for (const image of protocol.protocolAttachments) {
					// console.log("image.data", Buffer.from(image.data, "hex").toString("base64"));
					fileOptions.push({
						body: Buffer.from(image.data, "hex").toString("base64"),
						contentType: "image/jpeg",
						encoding: "base64",
					});
				}
				const imageRes = await fileEntity.create({
					options: fileOptions,
					noBroadcast: "no",
				});

				console.log("imageRes", imageRes);
				finalBody.protocolAttachments = imageRes.revealTxIds.map(
					(rid) => "metafile://" + rid + "i0"
				);
			}
			await sleep(5000);

			console.log("finalBody", finalBody);

			const createRes = await protocolEntity!.create({
				options: [{ body: JSON.stringify(finalBody) }],
				noBroadcast: "no",
			});
			console.log("create res for inscribe", createRes);
			if (!isNil(createRes?.revealTxIds[0])) {
				await sleep(5000);
				queryClient.invalidateQueries({ queryKey: ["metaprotocols"] });
				toast.success("create protocol successfully");
				protocolFormHandle.reset();
				onClearImageUploads();

				const doc_modal = document.getElementById(
					"new_protocol_modal"
				) as HTMLDialogElement;
				doc_modal.close();
			}
		} catch (error) {
			console.log("error", error);
			const errorMessage = (error as any)?.message;
			const toastMessage = errorMessage.includes("Cannot read properties of undefined")
				? "User Canceled"
				: errorMessage;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			toast.warn(toastMessage);
			setIsAdding(false);
		}
		setIsAdding(false);
	};

	return (
		<LoadingOverlay active={isAdding} spinner text="Submiting New Protocol...">
			<ProtocolForm
				onCreateSubmit={onCreateSubmit}
				protocolFormHandle={protocolFormHandle}
				onClearImageUploads={onClearImageUploads}
				filesPreview={filesPreview}
			/>
		</LoadingOverlay>
	);
};

export default ProtocolFormWrap;
