import React, { Component } from "react";
import SalariesContract from "./contracts/Salaries.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
	employees = { alicia: "0xe7D6a2a1cbEd37EE7446d78Fd5E6B38AAAe3f3B2", john: "0x574B4756606715Fb35f112ae8283b8a16319c895" };
	state = { balance: "0", web3: null, accounts: null, contract: null, timer: null };

	constructor(props) {
		super(props);
		this.refreshBalance = this.refreshBalance.bind(this)
	}

	componentDidMount = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const Contract = truffleContract(SalariesContract);
			Contract.setProvider(web3.currentProvider);
			const instance = await Contract.at("0xd53eb8f1a45A50B5f83D11d2b29CB0456fDE0175");

			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			this.setState({ web3, accounts, contract: instance }, this.refreshBalance);
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`
			);
			console.log(error);
		}
	};


	refreshBalance(){
		const fn = async() => {
			console.log("timer log...");
			const { contract } = this.state;

			try {
				const balance = await contract.balanceOf(this.employees.john);
				this.setState({
					...this.state,
					balance: balance.toString()
				});
			} catch (error) {
				alert(
					`Failed to read balance from contract`
				);
				console.log(error);
			}
		};
		fn();
		const timer = setInterval(fn, 16000);
		this.setState({ ...this.state, timer });
	}

	render() {
		const { web3 } = this.state;

		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			<div className="App-Container">
				<h2>
					<span role="img" aria-label="Rocket">🚀</span>
					Streaming Money
					<span role="img" aria-label="StarEyes">🤩</span>
				</h2>
				<div>You have {web3.utils.fromWei(this.state.balance) || 0} redeemable DAI</div>
			</div>
		);
	}
}

export default App;
