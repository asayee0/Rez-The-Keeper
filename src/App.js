import './App.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';

function SetGoldModal(props) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleSubmit = (event) => {
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

class ItemButton extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			itemCard: null
		}
		this.name = props.name;
		this.description = props.description;
		this.price = props.price;
		this.showItemCard = this.showItemCard.bind(this);
		this.hideItemCard = this.hideItemCard.bind(this);
	}
	showItemCard(){
		const itemCard = (
			<ItemCard 
				image="https://via.placeholder.com/300x200"
				title={this.name} 
				description={this.description}
			/>
			)
		this.setState({itemCard: itemCard});
	}
	hideItemCard(){
		this.setState({itemCard: null});
	}
	render(){
		return (
			<>
			<button 
				onClick={this.props.onClick} 
				onMouseOver={this.showItemCard} 
				onMouseLeave={this.hideItemCard}
			>
				{this.name} | Price: {this.price}G
				{this.state.itemCard}
			</button>
			</>
		);
	}
}

class ItemCard extends React.Component{
	render(){
		return(
			<><Card id="ItemCard" style={{ width: '18rem', display: this.props.display }}>
				<Card.Img id="ItemCardImage" src={this.props.image} />
				<Card.Body>
					<Card.Title>{this.props.title}</Card.Title>
					<Card.Text>
						{this.props.description}
					</Card.Text>
				</Card.Body>
			</Card></>
		)
		
	}
}

class ShopManager extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			cart: [],
			itemsForSale: [
				this.renderItem("Runeblade", "A blade from the Age of Runes.", 2600),
				this.renderItem("Dark Heart Armor Set", "A set of armor from the darkest of days.", 3000),
			],
			gold: 10000,
			itemCard: null
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
	renderItem(itemName, desc, price){
		return(
			<ItemButton
				name = {itemName}
				price = {price}
				description = {desc}
				onClick = {() => this.addItemToCart(itemName)}
				onMouseOver = {() => this.showItemCard()} 
				onMouseOut = {() => this.hideItemCard()}
			/>
		)
	}
	render(){
		const itemsForSale = this.state.itemsForSale.map(item => {
			return <div key={item.props.name}>{item}</div>
		})
		var cartKey = 0;
		const cart = this.state.cart.map(item =>
			<div key={cartKey++}>{item.props.name}</div>	
		)
		return (
			<>
			<SetGoldModal gold={this.state.gold} handleChange={this.handleGoldChange} />
			{itemsForSale}
			{cart}
			<button onClick={this.purchaseItemsInCart}>Purchase</button>
			<button onClick={this.resetCart}>Reset</button>
			{this.state.itemCard}
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
