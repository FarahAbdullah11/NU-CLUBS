import "./BookRoom.css";
import React, { useState } from "react";

interface BookRoomScreen {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

function BookRoom({ isOpen, onClose, onSubmit }: BookRoomScreen) {
  const [formData, setFormData] = React.useState({
    rooms: "",
    reason: "",
    days: "",
    time: "",
    specificRoom: "",
  });
  if (!isOpen) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit() {
    onSubmit(formData);
    onClose();
  }

  return (
    <div className="Room-overlay">
      <div className="Room">
        <div className="Room-header">
          <h2>Book a room</h2>
          <button className="close-button" onClick={onClose}>
            x
          </button>
        </div>
        <label>How many rooms do you need?</label>
        <input name="rooms" onChange={handleChange} />

        <label>What is your reason for booking the room</label>
        <input name="reason" onChange={handleChange} />

        <label>Which day(s) do you need the room(s)?</label>
        <input name="days" onChange={handleChange} />

        <label>What time do you need the room? (Start and end time)</label>
        <input name="time" onChange={handleChange} />

        <label>Do you need a specific room? If yes, enter room number(s)</label>
        <input name="specificRoom" onChange={handleChange} />

        <div className="Room-buttons">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="Submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
export default BookRoom;
