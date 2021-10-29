import React, { Component } from 'react';
import defaultBcg from '../images/room-1.jpeg';
// import Hero from '../components/Hero';
import Banner from '../components/Banner';
import { Link } from 'react-router-dom';
import { RoomContext } from '../context';
import StyledHero from '../components/StyledHero';


export default class SingleRoom extends Component {
    
    constructor(props) {
        super(props);
        // console.log(this.props);
        this.state = {
            slug: this.props.match.params.slug,
            defaultBcg
        }
    }
    static contextType = RoomContext;
    // componentDidMount() {

    // }
    
    render() {
        let charge = 7.5;
        const getTariff = () => {
            fetch('http://api.currencylayer.com/live?access_key=b2ac9cdf32ab43c4d02400992a0e0580')
            .then(response => response.json())
            .then(data => {
                const usdinr = Object(data.quotes)["USDINR"];
                let tariff = usdinr / 10;
                charge = tariff;
            })
            .catch(error => {
                console.log("Error : ", error);
            });
        };
        getTariff();
        const { getRoom } = this.context;
        const room = getRoom(this.state.slug);
        if(!room) {
            return <div className="error">
                <h3>no such room could be found . . .</h3>
                <Link to="/rooms/" className="btn-primary" >
                    go to rooms
                </Link>
            </div>;
        }
        const { name, description, capacity, size, price, extras, breakfast, pets, images } = room;
        const [mainImg,...defaultImg] = images;
        return (
            <>
            <StyledHero img={mainImg || this.state.defaultBcg} >
                <Banner title={`${name} room`} >
                    <Link to="/rooms/" className="btn-primary">
                        go to rooms
                    </Link>
                </Banner>
            </StyledHero>
            <section className="single-room">
                <div className="single-room-images">
                    {defaultImg.map((item, index) => {
                        return <img key={index} src={item} alt={name} />
                    })}
                </div>
                <div className="single-room-info">
                    <article className="desc">
                        <h3>details</h3>
                        <p>{description}</p>
                    </article>
                    <article className="info">
                        <h3>info</h3>
                        <h6>price: ₹{Math.round(price * parseFloat(charge)) - (Math.round(price * parseFloat(charge)) % 10)} </h6>
                        <h6>size: {size} sqft</h6>
                        <h6>
                            max capacity: {" "}
                                {capacity > 1 ? `${capacity} people` : `${capacity} person`}
                        </h6>
                        <h6>
                            {pets ? "pets allowed" : "no pets allowed"}
                        </h6>
                        <h6>
                            {breakfast && "free breakfast included"}
                        </h6>
                    </article>
                </div>
            </section>
            <section className="room-extras">
                <h6>extras</h6>
                <ul className="extras">
                    {extras.map((item, index) => {
                        return <li key={index} >- {item}</li>
                    })}
                </ul>
            </section>
            </>
        )
    }
}
