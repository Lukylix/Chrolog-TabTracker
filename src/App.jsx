import { useEffect, useState } from "react";
import { ReactComponent as ChrologIcon } from "./assets/chrolog.svg";
import { ReactComponent as AddListIcon } from "./assets/add-list.svg";
import "./App.css";

function App() {
	const [tab, setTab] = useState({});
	useEffect(() => {
		// send message to background.js
		chrome.runtime.sendMessage({ message: "getActiveTab" }, function (response) {
			console.log("tab", response.tab);
			setTab(response.tab);
		});
	}, []);
	return (
		<>
			<h1 className="d-inline">
				<ChrologIcon className="chrolog-icon" fill="white" height="25px" />
				hrolog
			</h1>
			<h3 className="d-inline justify-center">
				{tab?.domain}
				<AddListIcon
					className="add-icon"
					height="30px"
					fill="#FF6347"
					onClick={() =>
						fetch("http://localhost:9807//add-tab", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ domain: tab?.domain }),
						})
					}
				/>
			</h3>
		</>
	);
}

export default App;
