import React, { Component } from "react";
import { Link } from "react-router-dom";
import SalariesContract from "../contracts/Salaries.json";
import getWeb3 from "../utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
	employees = { alicia: "0xe7D6a2a1cbEd37EE7446d78Fd5E6B38AAAe3f3B2", john: "0x574B4756606715Fb35f112ae8283b8a16319c895" };
	state = { balance: "0.00", web3: null, accounts: null, contract: null, paying: false, timer: null };

	constructor(props) {
		super(props);
		this.refreshBalance = this.refreshBalance.bind(this);
		this.requestSalary = this.requestSalary.bind(this);
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

	refreshBalance() {
		const fn = async() => {
			console.log("timer log...");
			const { contract } = this.state;

			try {
				const balance = await contract.balanceOf(this.employees.alicia);
				this.setState({
					...this.state,
					balance: balance.toString(),
					paying: true
				});
			} catch (error) {
				this.setState({
					...this.state,
					balance: "0.00",
					paying: false
				});
				console.log("Failed to read balance from contract:", error);
			}
		};
		fn();
		const timer = setInterval(fn, 5050);
		this.setState({ ...this.state, timer });
	}

	async requestSalary() {
		const { accounts, contract, paying, web3 } = this.state;
		if (paying) {
			alert("Don't be greedy, you're already being paid a salary!");
			return;
		}
		
		try {
			const blockNumber = await web3.eth.getBlockNumber();
			const interval = "1";
			const startSalaryResult = await contract.startSalary(
				accounts[1],
				blockNumber + 100,
				blockNumber + 1100,
				web3.utils.toWei("0.0001", "ether"),
				interval,
				{
					from: accounts[0],
					value: web3.utils.toWei("0.1", "ether")
				}
			);
			console.log("startSalaryResult", startSalaryResult);
		} catch(error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to request salary. Check console for details.`
			);
			console.log(error);
		}
	}

	render() {
		const { accounts, web3 } = this.state;

		if (!web3) {
			return <div className='App-Container'>Loading Web3, accounts, and contract...</div>;
		}

		if (!accounts || accounts.length === 0) {
			return <div className='App-Container'>Please login to MetaMask...</div>;
		}
		console.log("accounts", accounts);

		return (
			<div className='App-Container'>
				<div className='App-Spacer'/>

				<div className='main-container'>
					<h1>
						<span role="img" aria-label="Rocket">🚀&nbsp;</span>
						Streaming Salaries
						<span role="img" aria-label="StarEyes">&nbsp;🤩</span>
					</h1>
					<p>
						Peeps using this dApp can get their salary once per 5 seconds. Once per month
						is old school. Join the <Link to="https://github.com/PaulRBerg/flipper" target="_blank" rel="noopener noreferrer">hive</Link>!
					</p>
					<div className="button-container">

						<button className='button -green center' onClick={this.requestSalary}>{this.state.paying ? "Paying..." : "Request Salary"}</button>

						<div className='button -salmon center'>{this.state.balance} DAI</div>

					</div>
				</div>

				<div className='App-Spacer'/>

				<div className='App-Footer'>
					<p>Note: currently the dApp has hardcoded values and only works hardcoded accounts.</p>
					<p>
						Developed by Honeybadgerz™. Powered by <Link to="https://poa.network">POA Network</Link> and <Link to="https://makerdao.com/">MakerDAO</Link>.
					</p>
				</div>
			</div>
		)
	}
}

export default App;