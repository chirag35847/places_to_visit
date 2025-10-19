import { useEffect, useState } from "react";

const TIMER = 3000;

export default function DeleteConfirmation({
  onConfirm, onCancel }) {
  const [remTime, setRemTime] = useState(TIMER);

  useEffect(() => {
    console.log('Running the useEffect')
    const timer = setTimeout(() => {
      console.log('executed setTimout')
      onConfirm();
    }, TIMER)

    return () => {
      console.log("clearing the timout")
      clearTimeout(timer)
    }
  }, [onConfirm])

  useEffect(() => {
    const interval = setInterval(() => {
      setRemTime((currentRemTime) => currentRemTime - 10);
    }, 10)

    return () => {
      clearInterval(interval);
    }
  }, [])

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <progress value={remTime} max={TIMER} />
    </div>
  );
}
