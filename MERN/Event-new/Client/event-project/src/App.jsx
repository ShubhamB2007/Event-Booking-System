import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import Events from './components/Events';
import EventDetail from './components/EventDetail';
import Organizer from './components/Organizer';
import Create from './components/Create';
import BookingList from './components/BookingList';

function App() {
  
  return (
    <Router>
    <div className='lg:w-[1521px] w-screen min-h-screen absolute bg-[#f6f6f6] overflow-x-hidden'>
        <Routes> 
            <Route
            path='/signup'
            element={<SignUp/>}
            />   
            <Route
            path='/login'
            element={<Login/>}
            />  
            <Route
            path='/'
            element={<Home/>}
            /> 
            <Route
            path='/events'
            element={<Events/>}
            />  
            <Route
            path='/event-detail/:id'
            element={<EventDetail/>}
            />
            <Route
            path='/organize-event'
            element={<Organizer/>}
            />  
            <Route
            path='/create-event'
            element={<Create/>}
            />  
            <Route
            path='/booking-list'
            element={<BookingList/>}
            />  
        </Routes>
    </div>
    </Router>
  )
}
 
export default App
