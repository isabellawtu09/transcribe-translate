import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'


// header component displays the speech scribe text above
// the webpage and the new button to begin a new transcription/translation

export default function Header(){

return(

    <header className = 'flex items-center justify-between gap-4 p-4 font-[Gaba'>
        <a href = "/"><h1 className = 'ml-4 font-medium text-xl'>Speech <span className = 'text-slate-600 bold'>Scribe</span></h1> </a>
       
        <a href = "/"><button className = 'mr-4 flex items-center gap-2 spcialbutton px-4 py-2 rounded-lg text-slate-600'>
          <p className = "font-bold">New</p>
          
          <FontAwesomeIcon icon = {faPlus}/>
        </button></a>
        
      </header>
);

}