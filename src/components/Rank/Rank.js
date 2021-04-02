import React from 'react';



const Rank = (props) => {
    return (
        <div>
            <div className="white f3 center">
                {props.name + ', your current rank is...'}
            </div>
            <div className="white f2 center">
                {props.rank}
            </div>
        </div>
    );
}

export default Rank;