import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { addProjectFiles, addTaskFiles } from '../../reducers/filesReducer';
import s from './CreateFiles.module.css';

export default function CreateFiles() {
  const dispatch = useDispatch();

  // Get the list of project files from Redux state
  const projectFiles = useSelector((state) => state.files.projectFiles);
  
    // Get the list of task files from Redux state
  const taskFiles = useSelector((state) => state.files.taskFiles);

  // Handle file upload and dispatch actions to update Redux state
  const handleFileUpload = (e, actionCreator) => {
    const uploadedFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    dispatch(actionCreator(uploadedFiles));
  };

  return (
    <div className={s.container}>
      {/* Header */}
      <div className={s.header}>
        <FaArrowLeft className={s.icon} />
        <span className={s.logo}>TROOD.</span>
        <span className={s.profile}>Profile</span>
      </div>

      {/* Projects Block */}
      <div className={s.block}>
        <h3 className={s.title}>Projects:</h3>
        <div className={s.card}>
          <div className={s.noFilesText}>
            {projectFiles.length === 0 ? 'Create project' : 'Uploaded files:'}
          </div>
          <ul className={s.fileList}>
            {projectFiles.map((file, index) => (
              <li key={index} className={s.fileItem}>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
          <label htmlFor="projectFileInput" className={s.fileInputLabel}>
            <FaPlus size={24} color="#555" />
          </label>
          <input
            id="projectFileInput"
            type="file"
            multiple
            className={s.fileInput}
            onChange={(e) => handleFileUpload(e, addProjectFiles)}
          />
        </div>
      </div>

      {/* Tasks Block */}
      <div className={s.block}>
        <h3 className={s.title}>Tasks:</h3>
        <div className={s.card}>
          <div className={s.noFilesText}>
            {taskFiles.length === 0 ? 'Create task' : 'Uploaded files:'}
          </div>
          <ul className={s.fileList}>
            {taskFiles.map((file, index) => (
              <li key={index} className={s.fileItem}>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
          <label htmlFor="taskFileInput" className={s.fileInputLabel}>
            <FaPlus size={24} color="#555" />
          </label>
          <input
            id="taskFileInput"
            type="file"
            multiple
            className={s.fileInput}
            onChange={(e) => handleFileUpload(e, addTaskFiles)}
          />
        </div>
      </div>
    </div>
  );
}
