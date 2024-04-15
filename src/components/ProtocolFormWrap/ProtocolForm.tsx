/* eslint-disable @typescript-eslint/no-explicit-any */
// import { FileEdit } from "lucide-react";
import { Paperclip } from "lucide-react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import cls from "classnames";
import { IsEncrypt } from "../../utils/file";
import { isEmpty, isNil } from "ramda";
import TagInput from "./TagInput";
import { useState } from "react";
import CustomFeerate from "../CustomFeerate";

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
	onCreateSubmit: SubmitHandler<ProtocolFormData>;
	protocolFormHandle: UseFormReturn<ProtocolFormData, any, undefined>;

	feeRateOptions: {
		name: string;
		number: number;
	}[];
	selectFeeRate: {
		name: string;
		number: number;
	};
	setSelectFeeRate: React.Dispatch<
		React.SetStateAction<{
			name: string;
			number: number;
		}>
	>;
	handleCustomFeeChange: (v: string) => void;
	customFee: string;
};

export type ProtocolFormData = {
	protocolTitle: string;
	protocolAttachments: FileList | undefined;
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

const ProtocolForm = ({
	onCreateSubmit,
	protocolFormHandle,
	feeRateOptions,
	handleCustomFeeChange,
	customFee,
	selectFeeRate,
	setSelectFeeRate,
}: IProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = protocolFormHandle;

	const files = watch("protocolAttachments");

	const [tags, setTags] = useState<string[]>([]);
	const onAddTag = (tag: string) => {
		if (tag === "") {
			return;
		}
		protocolFormHandle.clearErrors("tags");
		setTags((d) => {
			return [...d, tag];
		});
	};

	const onDeleteTag = (tag: string) => {
		if (
			isEmpty(
				tags.filter((t) => {
					return t !== tag;
				})
			)
		) {
			protocolFormHandle.setError("tags", { type: "Required" });
		}
		setTags((d) => {
			return d.filter((t) => {
				return t !== tag;
			});
		});
	};
	const [relatedPros, setRelatedPros] = useState<string[]>([]);

	const onAddRelatedPros = (relatedPro: string) => {
		if (relatedPro === "") {
			return;
		}
		setRelatedPros((d) => {
			return [...d, relatedPro];
		});
	};

	const onDeleteRelatedPros = (relatedPro: string) => {
		setRelatedPros((d) => {
			return d.filter((t) => {
				return t !== relatedPro;
			});
		});
	};

	return (
		<form
			onSubmit={handleSubmit((data) => {
				onCreateSubmit({ ...data, tags, relatedProtocols: relatedPros });
			})}
			className="mt-8 flex flex-col gap-6 font-mono"
		>
			<div className="flex flex-col gap-[30px] ">
				<label className="text-white relative">
					<div className="label label-text">Title</div>
					<input
						type="text"
						className={cls(
							"input input-sm bg-[black] !outline-none relative  max-w-[36rem] w-full",
							{
								"input-error": errors.protocolTitle,
							}
						)}
						placeholder="Enter here"
						{...register("protocolTitle", { required: true })}
					/>
					{errors.protocolTitle && (
						<span className="!text-error absolute left-2 top-[70px] text-sm">
							Protocol title can't be empty.
						</span>
					)}
				</label>

				<label className="text-white relative">
					<div className="label label-text">Author</div>
					<input
						type="text"
						className={cls(
							"input input-sm bg-[black] !outline-none relative  max-w-[36rem] w-full",
							{
								"input-error": errors.protocolAuthor,
							}
						)}
						placeholder="Enter here"
						{...register("protocolAuthor", { required: true })}
					/>
					{errors.protocolAuthor && (
						<span className="!text-error absolute left-2 top-[70px] text-sm">
							Protocol author can't be empty.
						</span>
					)}
				</label>

				<label className="text-white relative">
					<div className="label label-text">Name</div>
					<input
						type="text"
						className={cls(
							"input input-sm bg-[black] !outline-none relative  max-w-[36rem] w-full",
							{
								"input-error": errors.protocolName,
							}
						)}
						placeholder="Enter here"
						{...register("protocolName", { required: true })}
					/>
					{errors.protocolName && (
						<span className="!text-error absolute left-2 top-[70px] text-sm">
							Protocol name can't be empty.
						</span>
					)}
				</label>

				<label className="text-white relative">
					<div className="label label-text">Version</div>
					<input
						type="text"
						className={cls(
							"input input-sm bg-[black] !outline-none relative  max-w-[36rem] w-full",
							{
								"input-error": errors.protocolVersion,
							}
						)}
						placeholder="Enter here"
						{...register("protocolVersion", { required: true })}
					/>
					{errors.protocolVersion && (
						<span className="!text-error absolute left-2 top-[70px] text-sm">
							Protocol version can't be empty.
						</span>
					)}
				</label>

				<div className="flex justify-between gap-2">
					<div className="flex flex-col gap-2 w-1/2">
						<div className="text-white text-sm">Type</div>
						<select
							className={cls("select select-sm text-white bg-[black] !outline-none", {
								"select-error": errors.protocolType,
							})}
							{...register("protocolType", { required: true })}
						>
							<option>application/json</option>
							<option>image/apng</option>
						</select>
					</div>
					<div className="flex flex-col gap-2 flex-1">
						<div className="text-white text-sm">Encoding</div>
						<select
							className={cls("select select-sm text-white bg-[black] !outline-none", {
								"select-error": errors.protocolEncoding,
							})}
							{...register("protocolEncoding", { required: true })}
						>
							<option>text/plain</option>
							<option>application/json</option>
							<option>text/xml</option>
						</select>
					</div>
				</div>

				<label className="form-control relative">
					<div className="label flex justify-between">
						<span className="label-text text-white">Introduction</span>
						<select
							className={cls(
								"select select-sm text-white bg-[black] !outline-none w-[55%] max-w-xs",
								{
									"textarea-error": errors.protocolIntroductionType,
								}
							)}
							{...register("protocolIntroductionType", { required: true })}
						>
							<option>text/plain</option>
							<option>application/json</option>
							<option>text/xml</option>
						</select>
					</div>
					<textarea
						className={cls("textarea  text-white bg-[black] !outline-none h-24", {
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

				<label className="form-control relative">
					<div className="label flex justify-between">
						<span className="label-text text-white">Content</span>
						<select
							className={cls(
								"select select-sm text-white bg-[black] !outline-none w-[55%] max-w-xs",
								{
									"select-error": errors.protocolContentType,
								}
							)}
							{...register("protocolContentType", { required: true })}
						>
							<option>text/plain</option>
							<option>application/json</option>
							<option>text/xml</option>
						</select>
					</div>
					<textarea
						className={cls("textarea  text-white bg-[black] !outline-none h-24", {
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

				<label className="form-control relative">
					<div className="label flex justify-between">
						<span className="label-text text-white">Description</span>
						<select
							className={cls(
								"select select-sm text-white bg-[black] !outline-none w-[55%] max-w-xs",
								{
									"select-error": errors.protocolDescriptionType,
								}
							)}
							{...register("protocolDescriptionType", { required: true })}
						>
							<option>text/plain</option>
							<option>application/json</option>
							<option>text/xml</option>
						</select>
					</div>
					<textarea
						className={cls("textarea  text-white bg-[black] !outline-none h-24", {
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
				<div className="flex flex-col gap-4">
					<div className="flex gap-2 items-center">
						<div className="text-white text-sm">Tags </div>
						{errors.tags && (
							<div className="text text-error text-sm">tags can't be empty</div>
						)}
					</div>
					<TagInput
						onAddTag={onAddTag}
						onDeleteTag={onDeleteTag}
						tags={tags}
						placeHolder="enter here"
					/>
				</div>

				<div className="collapse bg-base-200 border border-white mr-[8%]">
					<input type="checkbox" />
					<div className="collapse-title text-white text-md font-medium">
						Click To Show/Hide Optional Parameters
					</div>
					<div className="collapse-content">
						<div className="flex flex-col gap-[8px]">
							<div className="text-white text-sm">Related Protocols</div>
							<TagInput
								onAddTag={onAddRelatedPros}
								onDeleteTag={onDeleteRelatedPros}
								tags={relatedPros}
								placeHolder="enter here"
							/>
							<div className="flex items-center self-start gap-2 mt-2">
								<div
									onClick={() => {
										document.getElementById("uploadAttachments")!.click();
									}}
									className="btn btn-xs btn-outline font-normal text-white flex items-center"
								>
									<Paperclip size={16} />
									<div>Select Attachment(s)</div>
								</div>
								{!isNil(files) && files.length !== 0 && (
									<div
										className="btn btn-xs btn-outline font-normal text-white"
										onClick={() => setValue("protocolAttachments", undefined)}
									>
										Clear Current Uploads
									</div>
								)}
							</div>
							<div className="flex gap-2">
								{!isNil(files) &&
									[...Array(files?.length ?? 0).keys()].map((d) => {
										const full = files[d].name;
										const name = full.split(".")[0];
										const ext = full.split(".")[1];
										return (
											<div
												key={d}
												className="border border-gray text-gray-50 text-xs rounded-md p-1 inline-block"
											>
												{name.length > 6
													? name.slice(0, 4) + "'''" + "." + ext
													: full}
											</div>
										);
									})}
							</div>
							<input
								type="file"
								multiple
								id="uploadAttachments"
								className="hidden"
								{...register("protocolAttachments")}
							/>
						</div>
					</div>
				</div>

				<CustomFeerate
					customFee={customFee}
					setSelectFeeRate={setSelectFeeRate}
					selectFeeRate={selectFeeRate}
					handleCustomFeeChange={handleCustomFeeChange}
					feeRateOptions={feeRateOptions}
				/>
			</div>

			<button
				className="btn btn-primary rounded-md font-medium w-full mt-4 flex self-center"
				type="submit"
			>
				Post
			</button>
		</form>
	);
};

export default ProtocolForm;
