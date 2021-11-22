import React, { useState, useEffect } from "react";
import "./Payment.css";
import { useSelector, useDispatch } from "react-redux";
import CurrencyFormat from "react-currency-format";
import CheckOutProduct from "../../components/CheckOutProduct/CheckOutProduct";
import { getBasketTotal } from "../../utils/BasketTotal";
import { useHistory, Link } from "react-router-dom";
import { db } from "../../utils/firebase";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "../../utils/axios";

const Payment = () => {
  const { basket, user } = useSelector((state) => state.data);

  let dispatch = useDispatch();
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState();

  useEffect(() => {
    const getClientSecret = async () => {
      try {
        const response = await axios({
          method: "post",
          // Stripe expects the total in a currencies subunits
          url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.log("Payment error: ", error);
        setError(error);
      }
    };
    getClientSecret();
  }, [basket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    console.log("clientSecret", clientSecret);
    console.log("CardElement", elements.getElement(CardElement));

    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement('card'),
        },
      })
      .then(({ paymentIntent }) => {
        // console.log("paymentIntent" , paymentIntent);
        db.collection("users")
          .doc(user && user.uid)
          .collection("orders")
          .doc(paymentIntent.id)
          .set({
            basket: basket,
            amount: paymentIntent.amount,
            created: paymentIntent.created,
          });
        setSucceded(true);
        setError(null);
        setProcessing(false);
        // dispatch({
        //   type: "EMPTY_BASKET",
        // });
        history.push("/orders");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment-container">
        <h1>Checkout {<Link to="/checkout">{basket.length} items</Link>}</h1>
        <div className="payment-section">
          <div className="payment-title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment-adress">
            <p>{user && user.email}</p>
            <p>House No. #2221 Near Banakar Petroleum, Hirekerur</p>
            <p>Tq Hirekerur, Dist Haveri</p>
            <p>Karnataka, India</p>
          </div>
        </div>

        <div className="payment-section">
          <div className="payment-title">
            <h3>Review items and Delivery</h3>
          </div>
          <div className="payment-items">
            {basket &&
              basket.map((item) => (
                <CheckOutProduct
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  image={item.image}
                  price={item.price}
                  rating={item.rating}
                />
              ))}
          </div>
        </div>

        <div className="payment-section">
          <div className="payment-title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment-details">
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />
              <div className="payment-priceContainer">
                <CurrencyFormat
                  renderText={(value) => (
                    <>
                      <h3> Order Total : {value}</h3>
                    </>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeprator={true}
                  perfix={"$"}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
