import './Calendar.css';
function Calendar(){
    return(
        <div className="calendar-container">
            <h1>Events Calendar </h1>
            <p className= "calendar-description">
                View all scheduled club activities in calendar format
                </p>
        <iframe
         src="https://calendar.google.com/calendar/embed?src=8a02c082a6ad8396788c17e87c5ffc784ff11c57abb4b9b0bf5246644ca7fafc%40group.calendar.google.com&ctz=Africa%2FCairo" 
        title = "Google Calendar"
           > </iframe>
            </div>
    );
}
export default Calendar;