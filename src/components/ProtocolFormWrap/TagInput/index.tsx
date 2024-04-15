/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import TagList from "./TagList";

type IProps = {
	tags: string[];
	onAddTag: (tag: string) => void;
	onDeleteTag: (tag: string) => void;
	placeHolder: string;
};

function TagInput({ tags, onAddTag, onDeleteTag, placeHolder }: IProps) {
	const [tempV, setTempV] = useState("");
	const onAddTagItem = () => {
		onAddTag(tempV);
		setTempV("");
	};

	const _onDeleteTag = (tag: string) => {
		onDeleteTag(tag);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-2 w-full">
				<input
					className="input input-sm w-full  text-white bg-[black] !outline-none"
					onChange={(e) => setTempV(e.currentTarget.value)}
					type="text"
					value={tempV}
					placeholder={placeHolder}
				/>
				<div className="btn btn-sm bg-main" onClick={() => onAddTagItem()}>
					+
				</div>
			</div>
			<TagList tags={tags} onDeleteTag={_onDeleteTag} />
		</div>
	);
}

export default TagInput;
