import { CircleX } from "lucide-react";
import React from "react";

type IProps = {
	onDeleteTag: (tag: string) => void;
	value: string;
};

function TagItem({ onDeleteTag, value }: IProps) {
	const tag = (
		<div className="relative inline-block ">
			<CircleX
				onClick={() => onDeleteTag(value)}
				fill="#E0E8F8"
				className="absolute text-[#1E1E1E] right-[-8px] top-[-6px] cursor-pointer  hover:scale-[1.3] duration-1000"
				size={18}
			/>
			<div className="btn btn-sm bg-main hover:bg-main  font-normal"> {value}</div>
		</div>
	);
	return <React.Fragment>{tag}</React.Fragment>;
}

export default TagItem;
