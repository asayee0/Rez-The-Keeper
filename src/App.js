import './App.css';
import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';

function Gold(props) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleSubmit = (event) => {
		event.preventDefault();
	}
	return (
		<>
		<button className="cart cart-btn set-gold" variant="primary" onClick={handleShow}>
			<h2 className="cart cart-text gold-figure">
				{props.gold} Gold
			</h2>
		</button>

		<Modal show={show} onHide={handleClose} backdrop={false}>
			<Form onSubmit={handleSubmit}>
				<InputGroup>
					<Form.Control type="number" placeholder="Set gold amount" onChange={props.handleChange}/>
					<button className="cart set-gold-confirm" type="submit" onClick={handleClose}>✓</button>
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
			itemCard: null,
			position: "relative",
			zIndex: 5,
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
		this.setState({
			itemCard: itemCard, 
			position: "absolute",
			zIndex: 10,
		});
	}
	hideItemCard(){
		this.setState({
			itemCard: null,
			position: "relative",
			zIndex: 5,
		});
	}
	render(){
		return (
			<>
			<button 
				onClick={this.props.onClick} 
				variant="secondary"
				className="shop item-btn item-btn--shop"
			>
				<div className="shop item-btn-layout-container">
					<div className="shop item-btn-img-container">
						<img src="http://via.placeholder.com/100" ></img>
					</div>
					<div className="shop item-btn-details">
						<h6 className="shop shop-text price">Price: {this.price}G</h6>
						<h5 className="shop shop-text name">{this.name}</h5>
						<p className="shop shop-text description">{this.description}</p>
					</div>
				</div>
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
			costOfCart: 0,
			itemsForSale: [
				this.renderItem("Runeblade", "A blade from the Age of Runes.", 2600),
				this.renderItem("Dark Heart Armor Set", "A set of armor from the darkest of days.", 3000),
				this.renderItem("Memory", "Who are we but our memories?", 333),
				this.renderItem("Soul Calibur", "A replica from a cool game.", 3500),
				this.renderItem("Cinder's Phylactery", "A phylactery belonging to the wicked lich, Count Cinder. Those who control the phylactery control the power.", 5500),
				this.renderItem("Blood of Sophia", "This phial is filled with the blood of the vampire, Sophia. Little is known of vampires.", 2100),
				this.renderItem("Tome of the Coast", "A manuscript of some sort written by a cult of wizards. Contains instructions and information about a different world.", 4000),
				this.renderItem("Puzzlebox Octahedron", "A puzzlebox with 8 sides. Curious.", 333),
			],
			gold: 100000,
			itemCard: null
		}
		this.addItemToCart = this.addItemToCart.bind(this);
		this.removeItemInCart = this.removeItemInCart.bind(this);
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
		var newTotal = this.state.costOfCart + item.props.price;
		this.setState({
			cart: cartItems,
			costOfCart: newTotal
		});
	}
	removeItemInCart(itemIndex){
		var item = this.state.cart[itemIndex];
		var cartItems = this.state.cart.splice(itemIndex, 1)
		var newTotal = this.state.costOfCart - item.props.price;
		this.setState({
			cart: cartItems,
			costOfCart: newTotal
		});
	}
	itemInCart(itemName){
		var item = this.getItemByName(itemName);
		return item !== undefined;
	}
	purchaseItemsInCart(){
		var totalCost = this.state.costOfCart;
		var userGold = this.state.gold;
		if (totalCost > userGold) console.log("You can't afford this! You have " + userGold + "G");
		else{
			userGold -= totalCost;
			this.setState({gold: userGold});
			console.log("Thank you for your purchase! You have " + this.state.gold + "G");
			this.resetCart();
		}
	}
	handleGoldChange(event){
		this.setState({gold : event.target.value});
	}
	resetCart(){
		this.setState({
			cart: [],
			costOfCart: 0,
		});
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
			return (
				<div key={item.props.name} className="shop item-container item-container--shop">
					{item}
				</div>
			)
		})
		var cartKey = 0;
		const cart = this.state.cart.map((item) => {
			var key = cartKey;
			cartKey++;
			return <button className="cart item-btn" onClick={() => this.removeItemInCart(key)} key={key}>{item.props.name}</button>	
		})
		return (
			<>
			<header>
				<h1>Rez, The Keeper</h1>
			</header>
			<main>
				<section id="ShopItems">
					<div className="shop shop-list-window">
						{itemsForSale}
					</div>
				</section>
				<section id="Cart">
					<section id="CartItemsList">
						<div className="cart cart-header">
							<h1 className="cart cart-text">Cart</h1>
							<div className="cart cart-reset-btn">
								<button className="cart item-btn reset-cart" onClick={this.resetCart}>Remove All</button>
							</div>
						</div>
						<div className="cart items-in-cart">
							{cart}
						</div>
					</section>
					<section id="CartDetails">
						<h1 className="cart cart-text">Total</h1>
						<h2 className="cart cart-text total-figure">{this.state.costOfCart}</h2>
						<button className="cart item-btn purchase" onClick={this.purchaseItemsInCart}>Purchase</button>
						<Gold gold={this.state.gold} handleChange={this.handleGoldChange} />
						<h4 className="cart cart-text your-gold">Your Gold (Click to set)</h4>
					</section>
				</section>
			</main>
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
