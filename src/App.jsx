import React, { useState,useRef, useeffect } from 'react'


import FileDisplay from './components/FileDisplay.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Header from './components/Header.jsx'



function App() {

    // initalize stream to null , by reference
      const [formData, setFormData] = useState('');
      const [recordedUrl, setRecordedUrl] = useState('');
      const [isRecording, setIsRecording] = useState(false);
      const mediaStream = useRef(null);
      const mediaRecorder = useRef(null);
      const [clipLabel , setClipLabel]= useState(null);
      const [stoppedRecording, setStoppedRecording] = useState(false);

      const {
          transcript,
          listening,
          browserSupportsSpeechRecognition
        } = useSpeechRecognition();
      
        if (!browserSupportsSpeechRecognition) {
          console.log("Browser doesn't support speech recognition");
        }
     
    
     const chunks = useRef([]);
     const startRecording = async () => {
     try {
      setIsRecording(true);
     const stream = await navigator.mediaDevices.getUserMedia(
     { audio: true }
     );
     mediaStream.current = stream;
     mediaRecorder.current = new MediaRecorder(stream);
     mediaRecorder.current.ondataavailable = (e) => {
     if (e.data.size > 0) {
     chunks.current.push(e.data);
     }
     };
     mediaRecorder.current.onstop = () => {
     const recordedBlob = new Blob(
     chunks.current, { type: 'audio/webm' }
     );
    
     
      const clipName = prompt(
          "Enter a name for your sound clip?",
          "My unnamed clip"
      );
    
      if (clipName === null) {
            setClipLabel( "My unnamed clip" );
          } else {
            setClipLabel(clipName);
          }
    
     const url = URL.createObjectURL(recordedBlob);
     setRecordedUrl(url);
     chunks.current = [];
     };
     mediaRecorder.current.start();
     } catch (error) {
     console.error('Error accessing microphone:', error);
     }
     };
     const stopRecording = () => {
      setIsRecording(false);
      setStoppedRecording(true);
     if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
     mediaRecorder.current.stop();
    
     }
     if (mediaStream.current) {
     mediaStream.current.getTracks().forEach((track) => {
     track.stop();
     });
     }
    
    
    
     };


  // in the case user does not record audio but instead uploads a file 
  const [uploadedFile, setUploadedFile] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRecordedUrl(url);
      setClipLabel(file.name);
      setUploadedFile(true);
    }
  };

  return (
    <div>
      <Header/>
      {(stoppedRecording || uploadedFile) ? (
        <FileDisplay transcript = {transcript} clipLabel={clipLabel} recordedUrl={recordedUrl}/> 
      ) : (
        <div className="flex flex-col items-center min-h-screen pt-23 px-8 font-[Gabarito]">
          <h1 className=" tracking-wide mt-10 text-6xl text-slate-600"><span className="text-black">Speech</span> Scribe</h1>
          <h2 className="pt-2 text-xl">Record <FontAwesomeIcon icon={faArrowRight}/> Transcribe <FontAwesomeIcon icon={faArrowRight}/> Translate</h2>
          <h3 className="pt-10 text-lg">Get started by recording your input</h3>
 
          <div className="justify-items-center pt-3 grid-cols-2">
            <button onClick={ () => { startRecording();
            SpeechRecognition.startListening();}}className={`mt-1 rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm ml-6 hover:bg-slate-900  ${isRecording ? 'text-red-400' : 'text-white'}`}
              type="button">
              Start <FontAwesomeIcon icon={faMicrophone} />
            </button>
    
            <button onClick={ () => {stopRecording();
            SpeechRecognition.stopListening();}}className="mt-1 rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white ml-6 hover:bg-slate-900 " type="button">
              Stop <FontAwesomeIcon icon={faMicrophoneSlash} />
            </button>
          </div>
    
          
        </div>
      )}
    </div>
  );
}

export default App;
