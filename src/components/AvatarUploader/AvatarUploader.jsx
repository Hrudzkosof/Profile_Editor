import React, { useRef } from "react";
import { TbCameraPlus } from "react-icons/tb";


export default function AvatarUploader({ avatar, onUpload }) {
  const fileInputRef = useRef(); // Ref to access the hidden file input element

   // Function to handle file selection and validate its size and format
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Access the selected file
    if (file && file.size <= 5 * 1024 * 1024) {  // Ensure file size is 5MB or less
      const reader = new FileReader(); // Create a FileReader to read the file as a data URL
      reader.onload = () => onUpload(reader.result); // Call the onUpload callback with the file's data URL
      reader.readAsDataURL(file);  // Start reading the file
    } else {
      alert("File is too large or in an incorrect format!");
    }
  };

  return (
    <div>
        {/* Clickable avatar area to trigger the file input */}
      <div
      
        onClick={() => fileInputRef.current.click()} // Simulate a click on the hidden file input
      >
        {avatar ? (
          <img src={avatar} alt="Avatar" /> // Display the current avatar if available
        ) : (
          <TbCameraPlus /> // Display a placeholder icon if no avatar is set
        )}
      </div>

      <input
        type="file" // Input type for selecting files
        accept="image/png, image/jpeg, image/jpg" // Restrict accepted file types to common image formats
        ref={fileInputRef} // Attach the ref for programmatic access
        onChange={handleFileChange} // Handle file selection
    

      />
    </div>
  );
}