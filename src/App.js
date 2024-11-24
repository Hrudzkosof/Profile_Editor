import { useEffect } from 'react';
import './App.css';

import ProfileForm from './components/ProfileForm/ProfileForm';
import { useDispatch } from 'react-redux';



function App() {
  const dispatch = useDispatch();


  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('profile'));
    if (savedProfile) {
      dispatch({ type: 'LOAD_PROFILE', payload: savedProfile });
    }
  }, [dispatch]);

  return (
    <div>
      
        <ProfileForm />
      
    </div>
  );
}

export default App;
