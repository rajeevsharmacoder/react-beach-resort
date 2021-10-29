import React from 'react';
import { useContext, useState } from 'react';
import { RoomContext } from '../context';
import Title from './Title';

// get all unique values
const getUnique = (items, value) => {
    return [...new Set(items.map(item => item[value]))]
}

export default function RoomFilter({rooms}) {
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
    const context = useContext(RoomContext);
    const { handleChange, type, capacity, price, minPrice, maxPrice, minSize, maxSize, breakfast, pets } = context;
    // get unique types
    let types = getUnique(rooms, 'type');
    // add all
    types = ['all', ...types];
    types = types.sort();
    // map to jsx
    types = types.map((item, index) => {
        return(
            <option value={item} key={index} >
                {item}
            </option>
        );
    })

    let people = getUnique(rooms, 'capacity');
    people = people.map((item, index) => {
        return(
            <option value={item} key={index} >
                {item}
            </option>
        );
    })
    return (
        <section className="filter-container">
            <Title title="search rooms" />
            <form className="filter-form" >
                {/* select type */}
                <div className="form-group">
                    <label htmlFor="type">room type</label>
                    <select name="type" id="type" value={type} className="form-control" onChange={handleChange}>
                        {types}
                    </select>
                </div>
                {/* end of select type */}

                {/* select guests */}
                <div className="form-group">
                    <label htmlFor="capacity">number of guests</label>
                    <select name="capacity" id="capacity" value={capacity} className="form-control" onChange={handleChange}>
                        {people}
                    </select>
                </div>
                {/* end of select guests */}

                {/* room price */}
                <div className="form-group">
                    <label htmlFor="price">room price ₹{Math.round(price * parseFloat(charge)) - (Math.round(price * parseFloat(charge)) % 10)}</label>
                    <input type="range" name="price" min={minPrice} max={maxPrice} id="price" value={price} className="form-control" onChange={handleChange} />
                </div>
                {/* end of room price */}

                {/* size */}
                <div className="form-group">
                    <label htmlFor="size">room size</label>
                    <div className="size-inputs">
                        <input type="number" name="minSize" id="size" value={minSize} className="size-input" onChange={handleChange} />
                        <input type="number" name="maxSize" id="size" value={maxSize} className="size-input" onChange={handleChange} />
                    </div>
                </div>
                {/* end of size */}

                {/* extras */}
                <div className="form-group">
                    <div className="single-extra" >
                        <input type="checkbox" name="breakfast" id="breakfast" checked={breakfast} onChange={handleChange} />
                        <label htmlFor="breakfast">breakfast</label>
                    </div>
                    <div className="single-extra" >
                        <input type="checkbox" name="pets" id="pets" checked={pets} onChange={handleChange} />
                        <label htmlFor="pets">pets</label>
                    </div>
                </div>
                {/* end of extras */}
            </form>
        </section>
    )
}
