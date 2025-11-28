import { Hero } from '../components/Hero';
import Calendar from '../components/Calendar';
import Navbar from '../components/navbar';

function Homepage(){
    return(
        <div>
            <Navbar />
            <Hero />
            <Calendar />
        </div>
    );
}
export default Homepage;