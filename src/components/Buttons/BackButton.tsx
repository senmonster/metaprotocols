import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
	const navigate = useNavigate();
	return (
		<button
			className="btn btn-md mb-6 bg-neutral-900 hover:bg-neutral-700 p-0 pl-2 pr-4 border-none"
			onClick={() => navigate("/")}
		>
			<ChevronLeft />
			return
		</button>
	);
};

export default BackButton;
