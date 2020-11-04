import './App.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function SetGoldModal(props) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleSubmit = (event) => {
		console.log(props.gold);
		event.preventDefault();
	}
	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				{props.gold} Gold
			</Button>

			<Modal show={show} onHide={handleClose} backdrop={false}>
				<Form onSubmit={handleSubmit}>
					<InputGroup>
						<Form.Control type="number" placeholder="Set gold amount" onChange={props.handleChange}/>
						<Button type="submit" onClick={handleClose}>✓</Button>
					</InputGroup>
				</Form>
			</Modal>
		</>
	);
}

class Item extends React.Component{
	constructor(props){
		super(props);
		this.name = props.name;
		this.price = props.price;
	}
	render(){
		return (
			<button onClick={this.props.onClick}>{this.name} | Price: {this.price}G</button>
		);
	}
}

class ShopManager extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			cart: [],
			itemsForSale: [
				this.renderItem("Runeblade", 2600),
				this.renderItem("Dark Heart Armor Set", 2800),
				this.renderItem("Soul Calibur", 3000),
			],
			gold: 10000,
		}
		this.addItemToCart = this.addItemToCart.bind(this);
		this.getItemByName = this.getItemByName.bind(this);
		this.purchaseItemsInCart = this.purchaseItemsInCart.bind(this);
		this.resetCart = this.resetCart.bind(this);
		this.handleGoldChange = this.handleGoldChange.bind(this);
	}
	getItemByName(itemName){
		return this.state.itemsForSale.find(item => item.props.name === itemName);
	}
	addItemToCart(itemName){
		//push returns the new array length; concat returns the new array
		var item = this.getItemByName(itemName);
		var cartItems = this.state.cart.concat(item);
		this.setState({cart: cartItems});
		console.log(this.state.cart);
	}
	itemInCart(itemName){
		var item = this.getItemByName(itemName);
		return item !== undefined;
	}
	purchaseItemsInCart(){
		var totalCost = 0;
		var userGold = this.state.gold;
		this.state.cart.map((item) => {
			return totalCost += item.props.price;
		});
		if (totalCost > userGold) console.log("You can't afford this! You have " + userGold + "G");
		else{
			userGold -= totalCost;
			this.setState({gold: userGold});
			console.log("Thank you for your purchase! You have " + userGold + "G");
			this.resetCart();
		}
	}
	handleGoldChange(event){
		this.setState({gold : event.target.value});
	}
	resetCart(){
		this.setState({cart: []});
	}
	renderItem(itemName, price){
		return(
			<Item
				name = {itemName}
				price = {price}
				onClick = {() => this.addItemToCart(itemName)}
			/>
		)
	}
	render(){
		const itemsForSale = this.state.itemsForSale.map(item => {
			return <div key={item.props.name}>{item}</div>
		})
		const cart = this.state.cart.map(item =>
			<div>{item.props.name}</div>	
		)
		return (
			<>
				<SetGoldModal gold={this.state.gold} handleChange={this.handleGoldChange} />
				{itemsForSale}
				{cart}
				<button onClick={this.purchaseItemsInCart}>Purchase</button>
				<button onClick={this.resetCart}>Reset</button>
			</>
		);
	}
}

function App(){
	return(
		<>
			<ShopManager />
		</>
	)
}

export default App;
