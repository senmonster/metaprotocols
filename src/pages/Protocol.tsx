// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import { fetchProtocol } from "../api/protocol";
import BackButton from "../components/Buttons/BackButton";
// import ProtocolCard from "../components/ProtocolList/ProtocolCard";

const Protocol = () => {
	// const { id: tempId } = useParams();
	// const id = tempId ?? "";
	// const { isLoading, data: protocol } = useQuery({
	// 	queryKey: ["protocol", id],
	// 	queryFn: () => fetchProtocol(id),
	// });

	return (
		<div>
			<BackButton />
			<div>To Do change to Protocol detail</div>
			{/* <div className="mt-6">
				{isLoading ? (
					<div className="grid place-items-center h-[200px]">
						<span className="loading loading-ring loading-lg grid text-white"></span>
					</div>
				) : (
					<ProtocolCard protocolItem={protocol} />
					
				)}
			</div> */}
		</div>
	);
};

export default Protocol;
