import React from 'react';



const Rank = (props) => {
    return (
        <div>
            <div className="white f3 center">
                {props.name + `, you have used this application ${props.rank} times`}
            </div>
          
        </div>
    );
}

export default Rank;