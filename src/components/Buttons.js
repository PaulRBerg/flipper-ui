import React, { Component } from "react";

import "./Buttons.css";

class Buttons extends Component {

	render() {
		return (
			<div className='container'>
				<h1>
					Buttons
				</h1>
				<p>
					Random selection of button styles. May change over time as I get alot of stupid ideas. Feel free to
					follow me on <a href="https://twitter.com/simonbusborg" target="_blank" rel="noopener noreferrer"
					                className="twitter">twitter</a>
				</p>
				<div className="button-container">
					<div className='button -regular center'>Let's start</div>

					<div className='button -dark center'>Touch me</div>

					<div className='button -green center'>Just like that</div>

					<div className='button -blue center'>And that, oh, yeah</div>

					<div className='button -salmon center'>Now that I like</div>

					<div className='button -sun center'>God, that's so nice</div>

					<div className='button -alge center'>Now lower down</div>

					<div className='button -flower center'>Where the figs lie</div>

				</div>
			</div>
		)
	}
}

export default Buttons;