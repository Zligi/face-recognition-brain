import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <p className='f3 nice'>
        {"This Magic Brain will detect faces in your pictures. Give it a try."}
      </p>
      <div className='center'>
        <div className='center form pa4 br3 shadow-5'>
          <input
            className='input f4 pa2 w-70 center'
            type='text'
            onChange={onInputChange}
          />
          <button
            type='button'
            className='w-30 grow f4 link ph3 pv2 dib white bg-blue'
            onClick={onButtonSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
