/* eslint-disable @typescript-eslint/no-explicit-any */
// import { FileEdit } from "lucide-react";
import { Paperclip } from "lucide-react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import cls from "classnames";
import { IsEncrypt } from "../../utils/file";
import { isNil } from "ramda";

export interface AttachmentItem {
	fileName: string;
	fileType: string;
	data: string;
	encrypt: IsEncrypt;
	sha256: string;
	size: number;
	url: string;
}

type IProps = {
	// onSubmit: (protocol: { content: string; images: AttachmentItem[] }) => void;
	onCreateSubmit: SubmitHandler<ProtocolFormData>;
	protocolFormHandle: UseFormReturn<ProtocolFormData, any, undefined>;
	onClearImageUploads: () => void;
	filesPreview: string[];
};

export type ProtocolFormData = {
	protocolTitle: string;
	protocolAttachments: FileList;
	// protocolHASHID: string;
	protocolAuthor: string;
	protocolName: string;
	protocolVersion: string;
	protocolType: "application/json" | "image/apng" | "audio/aac";
	protocolEncoding: "UTF-8" | "text/plain" | "applicaiton/json" | "text/xml";
	protocolIntroduction: string;
	protocolIntroductionType: "text/plain" | "text/html" | "text/markdown"; // https://www.iana.org/assignments/charactersets/character-sets.xhtml
	protocolContent: string;
	protocolContentType: "text/plain" | "text/html" | "text/markdown";
	protocolDescription: string;
	protocolDescriptionType: "text/plain" | "text/html" | "text/markdown";
	tags: string[];
	relatedProtocols: string[];
};

const ProtocolForm = ({ onCreateSubmit, protocolFormHandle, onClearImageUploads }: IProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = protocolFormHandle;
	const files = watch("protocolAttachments");

	// const onCreateSubmit: SubmitHandler<ProtocolData> = async (data) => {
	// 	const images = data.images.length !== 0 ? await image2Attach(data.images) : [];

	// 	onSubmit({
	// 		content: data.content,
	// 		images,
	// 	});
	// 	console.log("attachments", images);
	// };
	// console.log("files", files);
	return (
		<form onSubmit={handleSubmit(onCreateSubmit)} className="mt-8 flex flex-col gap-6">
			<div className="flex flex-col gap-[24px] ">
				<label
					className={cls(
						"input input-bordered input-sm flex items-center gap-2 relative ",
						{
							"input-error": errors.protocolTitle,
						}
					)}
				>
					* Title
					<input
						type="text"
						className="grow"
						placeholder="Enter here"
						{...register("protocolTitle", { required: true })}
					/>
					{errors.protocolTitle && (
						<span className="!text-error absolute left-4 top-[32px] text-sm">
							Protocol title can't be empty.
						</span>
					)}
				</label>

				<label
					className={cls(
						"input input-bordered input-sm flex items-center gap-2 relative",
						{
							"input-error": errors.protocolAuthor,
						}
					)}
				>
					* Author
					<input
						type="text"
						className="grow"
						placeholder="Enter here"
						{...register("protocolAuthor", { required: true })}
					/>
					{errors.protocolAuthor && (
						<span className="!text-error absolute left-4 top-[32px] text-sm">
							Protocol author can't be empty.
						</span>
					)}
				</label>

				<label
					className={cls(
						"input input-bordered input-sm flex items-center gap-2 relative ",
						{
							"input-error": errors.protocolName,
						}
					)}
				>
					* Name
					<input
						type="text"
						className="grow"
						placeholder="Enter here"
						{...register("protocolName", { required: true })}
					/>
					{errors.protocolName && (
						<span className="!text-error absolute left-4 top-[32px] text-sm">
							Protocol Name can't be empty.
						</span>
					)}
				</label>

				<label
					className={cls(
						"input input-bordered input-sm flex items-center gap-2 relative ",
						{
							"input-error": errors.protocolVersion,
						}
					)}
				>
					* Version
					<input
						type="text"
						className="grow"
						placeholder="Enter here"
						{...register("protocolVersion", { required: true })}
					/>
					{errors.protocolVersion && (
						<span className="!text-error absolute left-4 top-[32px] text-sm">
							Protocol Version can't be empty.
						</span>
					)}
				</label>
				<div className="flex items-center justify-between">
					<div className="text-white text-sm">* Type</div>
					<select
						className={cls("select select-bordered select-sm w-[55%] max-w-xs", {
							"select-error": errors.protocolType,
						})}
						{...register("protocolType", { required: true })}
					>
						<option>application/json</option>
						<option>image/apng</option>
					</select>
				</div>
				<div className="flex items-center justify-between ">
					<div className="text-white text-sm">* Encoding</div>
					<select
						className={cls("select select-bordered select-sm w-[55%] max-w-xs", {
							"select-error": errors.protocolEncoding,
						})}
						{...register("protocolEncoding", { required: true })}
					>
						<option>text/plain</option>
						<option>application/json</option>
						<option>text/xml</option>
					</select>
				</div>

				<label className="form-control relative">
					<div className="label">
						<span className="label-text text-white">* Introduction</span>
					</div>
					<textarea
						className={cls("textarea textarea-bordered h-24", {
							"textarea-error": errors.protocolIntroduction,
						})}
						placeholder="Enter here"
						{...register("protocolIntroduction", { required: true })}
					></textarea>

					{errors.protocolIntroduction && (
						<span className="!text-error absolute left-4 bottom-[-20px] text-sm">
							Protocol Introduction can't be empty.
						</span>
					)}
				</label>

				<div className="flex items-center justify-between ">
					<div className="text-white text-sm">* IntroductionType</div>
					<select
						className={cls("select select-bordered select-sm w-[55%] max-w-xs", {
							"textarea-error": errors.protocolIntroductionType,
						})}
						{...register("protocolIntroductionType", { required: true })}
					>
						<option>text/plain</option>
						<option>application/json</option>
						<option>text/xml</option>
					</select>
				</div>

				<label className="form-control relative">
					<div className="label">
						<span className="label-text text-white">* Content</span>
					</div>
					<textarea
						className={cls("textarea textarea-bordered h-24", {
							"textarea-error": errors.protocolContent,
						})}
						placeholder="Enter here"
						{...register("protocolContent", { required: true })}
					></textarea>
					{errors.protocolContent && (
						<span className="!text-error absolute left-4 bottom-[-20px] text-sm">
							Protocol Content can't be empty.
						</span>
					)}
				</label>

				<div className="flex items-center justify-between">
					<div className="text-white text-sm">* ContentType</div>
					<select
						className={cls("select select-bordered select-sm w-[55%] max-w-xs", {
							"select-error": errors.protocolContentType,
						})}
						{...register("protocolContentType", { required: true })}
					>
						<option>text/plain</option>
						<option>application/json</option>
						<option>text/xml</option>
					</select>
				</div>

				<label className="form-control relative">
					<div className="label">
						<span className="label-text text-white">* Description</span>
					</div>
					<textarea
						className={cls("textarea textarea-bordered h-24", {
							"textarea-error": errors.protocolDescription,
						})}
						placeholder="Enter here"
						{...register("protocolDescription", { required: true })}
					></textarea>
					{errors.protocolDescription && (
						<span className="!text-error absolute left-4 bottom-[-20px] text-sm">
							Protocol Description can't be empty.
						</span>
					)}
				</label>

				<div className="flex items-center justify-between ">
					<div className="text-white text-sm">* DescriptionType</div>
					<select
						className={cls("select select-bordered select-sm w-[55%] max-w-xs", {
							"select-error": errors.protocolDescriptionType,
						})}
						{...register("protocolDescriptionType", { required: true })}
					>
						<option>text/plain</option>
						<option>application/json</option>
						<option>text/xml</option>
					</select>
				</div>
				<div className="text-white text-sm">Tags: PayLike ｜ Buzz</div>
				<div className="collapse bg-base-200 border border-white mr-[8%]">
					<input type="checkbox" />
					<div className="collapse-title text-white text-xl font-medium">
						Click To Show/Hide Optional Parameters
					</div>
					<div className="collapse-content">
						<div className="flex flex-col gap-[24px]">
							<div className="text-white text-sm">Related Protocols: msg ｜ file</div>

							<div className="flex items-center self-start gap-2">
								{!isNil(files) && files.length !== 0 && (
									<div
										className="btn btn-xs btn-outline font-normal text-white"
										onClick={onClearImageUploads}
									>
										clear current uploads
									</div>
								)}
								<div
									onClick={() => {
										document.getElementById("addAttachments")!.click();
									}}
									className="btn btn-xs btn-outline font-normal text-white "
								>
									<Paperclip size={16} />
									Add Attachment
								</div>
							</div>
							<input
								type="file"
								multiple
								id="addAttachments"
								className="hidden"
								{...register("protocolAttachments")}
							/>
						</div>
					</div>
				</div>
			</div>

			<button
				className="btn btn-primary rounded-full font-medium w-[120px] flex self-center"
				type="submit"
			>
				Post
			</button>
		</form>
	);
};

export default ProtocolForm;
