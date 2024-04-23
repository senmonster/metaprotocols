import { useAtomValue } from "jotai";
import { Link } from "react-router-dom";

import { connectedAtom, initStillPoolAtom, userInfoAtom } from "../store/user";

import { checkMetaletConnected, checkMetaletInstalled } from "../utils/wallet";
import ProtocolFormWrap from "./ProtocolFormWrap";
import CustomAvatar from "./CustomAvatar";
import { Plus } from "lucide-react";

type IProps = {
	onWalletConnectStart: () => Promise<void>;
	onLogout: () => void;
};

const Navbar = ({ onWalletConnectStart, onLogout }: IProps) => {
	const connected = useAtomValue(connectedAtom);
	const userInfo = useAtomValue(userInfoAtom);
	const stillPool = useAtomValue(initStillPoolAtom);

	const onProtocolStart = async () => {
		await checkMetaletInstalled();
		await checkMetaletConnected(connected);
		if (stillPool) {
			return;
		}
		const doc_modal = document.getElementById("new_protocol_modal") as HTMLDialogElement;
		doc_modal.showModal();
	};

	const onEditProfileStart = async () => {
		const doc_modal = document.getElementById("edit_metaid_modal") as HTMLDialogElement;
		doc_modal.showModal();
	};
	// console.log("userInfo", userInfo);
	return (
		<>
			<div className="z-10 navbar p-3   bg-main absolute top-0 font-mono">
				<div className="container flex justify-between px-6 items-center">
					<Link to={"/"} className="w-[200px] h-[50px] grid place-items-center">
						<img src="/header-logo.png" className="pt-2" />
					</Link>

					<div className="flex items-center gap-2">
						<button
							className="btn cursor-pointer hover:border-none hover:bg-neutral-600 bg-neutral-900 border-none rounded-xl font-medium w-[150px]"
							onClick={onProtocolStart}
						>
							<Plus size={18} onClick={onProtocolStart} />
							Add
						</button>

						{connected ? (
							<div className="dropdown dropdown-hover">
								{/* <div tabIndex={0} role="button" className="btn m-1">Hover</div> */}
								<div tabIndex={0} role="button" className="cursor-pointer">
									<CustomAvatar userInfo={userInfo!} />
								</div>
								<ul
									tabIndex={0}
									className="bg-[#0C0C45] dropdown-content z-[1] menu px-4 py-4 gap-3 shadow-md shadow-blue-800/80 bg-main rounded-box w-[200px] border border-blue-800/80 left-[-86px] text-blue-500"
								>
									<li
										className="hover:bg-blue-900 rounded-box relative"
										onClick={onEditProfileStart}
									>
										<img
											src="/profile-icon.png"
											width={55}
											height={55}
											className="absolute left-0 top-0"
										/>
										<a
											className=" text-[14px]"
											style={{ textIndent: "2.2em" }}
										>{`Edit Profile`}</a>
									</li>
									<div className="border border-blue-800/50 w-[80%] mx-auto"></div>
									<li
										className="hover:bg-blue-900 rounded-box relative"
										onClick={onLogout}
									>
										<img
											src="/logout-icon.png"
											width={55}
											height={55}
											className="absolute left-0 top-0"
										/>
										<a className=" text-[14px]" style={{ textIndent: "2.5em" }}>
											Log out
										</a>
									</li>
								</ul>
							</div>
						) : (
							<div
								className="btn btn-outline bg-blue-800 border-none hover:bg-blue-500 font-medium rounded-xl"
								onClick={onWalletConnectStart}
							>
								Connect Wallet
							</div>
						)}
					</div>
				</div>
			</div>
			<dialog id="new_protocol_modal" className="modal">
				<div className="modal-box bg-[#191C20] py-5 max-w-[36rem]">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="border border-white text-white btn btn-xs btn-circle absolute right-5 top-5.5">
							✕
						</button>
					</form>
					<h3 className="font-medium text-white text-[24px] text-center">New Protocol</h3>
					<ProtocolFormWrap />
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</>
	);
};

export default Navbar;
