import React from 'react';
import './ImageLinkForm.css';


const ImageLinkForm = ({ onInputChange, onButtonSubmit, userID }) => {
    return (
        <div>
        <p className='f3 center moto'>
            {'Find an image to detect faces'}
        </p>
        <div className='center'>
            <div className='form center pa4 br3 shadow-4'>
            <input className='f4 pa2 w-70 center' type='text' placeholder="image url" onChange={onInputChange}/>
            <button
                className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onButtonSubmit}>Detect</button>
            </div>
        </div>
        </div>
    );
}

export default ImageLinkForm;