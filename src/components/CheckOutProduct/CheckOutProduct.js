import React from 'react';
import './CheckOutProduct.css';
import { useDispatch } from 'react-redux';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { removeFromBasket } from '../../redux/actions';

const CheckOutProduct = ({ id, title, image, rating, price }) => {

    let dispatch = useDispatch();

    const removeItemFromBasket = () => {
        dispatch(removeFromBasket(id));
    }

    return (
        <div className="checkout-product">
            <img src={image} alt="" className="checkout-product-image" />
            <div className="checkout-product-info">
                <p className="checkout-product-title">{title}</p>
                <p className="checkout-product-price">
                    <strong>{price}</strong>
                    <strong>₹</strong>
                </p>
                <div className="checkout-product-rating">
                    {Array(rating).fill().map((_, index) => <p key={index}>⭐</p>)}
                </div>
                <button onClick={removeItemFromBasket}>
                    <i>
                        <ShoppingCartIcon/>
                    </i>
                    Remove from Basket
                </button>
            </div>
        </div>
    )
}

export default CheckOutProduct;
