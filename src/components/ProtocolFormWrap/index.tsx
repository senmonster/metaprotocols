/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createProtocol } from '../api/protocol';
import ProtocolForm, { AttachmentItem, ProtocolData } from "./ProtocolForm";
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
const ProtocolFormWrap = () => {
	const protocolEntity = useAtomValue(protocolEntityAtom);
	const btcConnector = useAtomValue(btcConnectorAtom);

	const [isAdding, setIsAdding] = useState(false);
	const queryClient = useQueryClient();

	const protocolFormHandle = useForm<ProtocolData>();
	const files = protocolFormHandle.watch("images");
	console.log(protocolFormHandle.getValues("images"));
	const [filesPreview, setFilesPreview] = useImagesPreview(files);
	const onClearImageUploads = () => {
		setFilesPreview([]);
		protocolFormHandle.setValue("images", [] as any);
	};

	const onCreateSubmit: SubmitHandler<ProtocolData> = async (data) => {
		const images = data.images.length !== 0 ? await image2Attach(data.images) : [];

		await handleAddProtocol({
			content: data.content,
			images,
		});
		console.log("data images", data.images, filesPreview);
	};

	const handleAddProtocol = async (protocol: { content: string; images: AttachmentItem[] }) => {
		setIsAdding(true);
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const finalBody: any = { content: protocol.content };
			if (!isEmpty(protocol.images)) {
				const fileOptions: CreateOptions[] = [];

				const fileEntity = await btcConnector!.use("file");

				for (const image of protocol.images) {
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
				finalBody.attachments = imageRes.revealTxIds.map(
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
				queryClient.invalidateQueries({ queryKey: ["protocoles"] });
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
		<LoadingOverlay active={isAdding} spinner text="Creating Protocol...">
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

// const AddProtocol = () => {
// 	const queryClient = useQueryClient();

// 	const createProtocolMutation = useMutation({
// 		mutationFn: createProtocol,
// 		onSuccess: async () => {
// 			await queryClient.invalidateQueries({ queryKey: ["protocoles"] });
// 			toast.success("create protocol success!");
// 			const doc_modal = document.getElementById("new_protocol_modal") as HTMLDialogElement;
// 			doc_modal.close();
// 		},
// 	});

// 	const handleAddProtocol = (protocol: ProtocolNewForm) => {kl
// 		const id = uuidv4();
// 		createProtocolMutation.mutate({
// 			...protocol,
// 			id,
// 			createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
// 			user: "vae",
// 			isFollowed: false,
// 			txid: id,
// 		});
// 	};

// 	return (
// 		<LoadingOverlay active={createProtocolMutation.isPending} spinner text="Protocol is Creating...">
// 			<ProtocolForm onSubmit={handleAddProtocol} initialValue={{ content: "", createTime: "" }} />{" "}
// 		</LoadingOverlay>
// 	);
// };

// export default AddProtocol;
