import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import defaultImg from '../images/room-1.jpeg';
import PropTypes from 'prop-types';

export default function Room({ room }) {
    const { name, slug, images, price } = room;
    const [charge, setCharge] = useState(7.5);
    const getTariff = () => {
        fetch('http://api.currencylayer.com/live?access_key=b2ac9cdf32ab43c4d02400992a0e0580')
        .then(response => response.json())
        .then(data => {
            const usdinr = Object(data.quotes)["USDINR"];
            let tariff = usdinr / 10;
            setCharge(tariff);
        })
        .catch(error => {
            console.log("Error : ", error);
            setCharge(7.5);
        });
    };
    getTariff();
    return (
        <article className="room">
            <div className="img-container">
                <img src={images[0] || defaultImg} alt="single room" />
                <div className="price-top">
                    <h6>₹{Math.round(price * parseFloat(charge)) - (Math.round(price * parseFloat(charge)) % 10)}</h6>
                    <p>per night</p>
                </div>
                <Link to={`/rooms/${slug}`} className="btn-primary room-link">
                    features
                </Link>
            </div>
            <p className="room-info">
                {name}
            </p>
        </article>
    )
}

Room.propTypes = {
    room: PropTypes.shape({
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
        price: PropTypes.number.isRequired
    })
};