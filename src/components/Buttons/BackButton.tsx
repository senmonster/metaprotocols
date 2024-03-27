import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
	const navigate = useNavigate();
	return (
		<button className="btn btn-lg btn-ghost p-0 pr-2 border-none" onClick={() => navigate("/")}>
			<ChevronLeft />
			return
		</button>
	);
};

export default BackButton;
