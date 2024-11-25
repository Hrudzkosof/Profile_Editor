import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { TbCameraPlus } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import { setAvatar } from "../../reducers/profileReducer";
import s from "./ProfileForm.module.css";
import CreateFiles from "../CreateFiles/CreateFiles";
import { BiErrorCircle } from "react-icons/bi";

export default function ProfileForm() {
  const profile = useSelector((state) => state.profile); // Get profile data from Redux state
  const dispatch = useDispatch(); // Dispatch actions to Redux store


  const [tags, setTags] = useState([]); // State for managing user tags
  const [potentialTags, setPotentialTags] = useState([]); // State for managing potential interests
  const [links, setLinks] = useState([]); // State for managing external links
  const [profileVisibility, setProfileVisibility] = useState("Private"); // State for profile visibility (Private/Public)

  const { register, setValue, watch, reset, handleSubmit, formState: { errors } } = useForm({
    defaultValues: profile, // Set initial form values to Redux profile data
    mode: "onBlur" // Validate inputs on blur
  });

  const avatar = watch("avatar"); // Watch for changes in the avatar field
  const fileInputRef = useRef(); // Reference to hidden file input for uploading avatar


  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      reset(parsedProfile); // Populate form fields with saved profile data
      setTags(parsedProfile.tags || []);
      setPotentialTags(parsedProfile.potentialTags || []);
      setLinks(parsedProfile.links || []);
      setProfileVisibility(parsedProfile.profileVisibility || "Private");
    }
  }, [reset]);

   // Save profile data to localStorage whenever tags, potentialTags, links, or profileVisibility change
  useEffect(() => {
    const saveProfileToStorage = () => {
      const updatedProfile = {
        ...watch(), // Get form values
        tags,
        potentialTags,
        links,
        profileVisibility,
      };
      localStorage.setItem("profile", JSON.stringify(updatedProfile)); // Save profile to localStorage
    };

    saveProfileToStorage();
  }, [tags, potentialTags, links, profileVisibility, watch]);

  // Load profile visibility from localStorage on component mount
  useEffect(() => {
    const savedVisibility = localStorage.getItem("profileVisibility");
    if (savedVisibility) {
      setProfileVisibility(savedVisibility);
    }
  }, []);

   // Save profile visibility to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("profileVisibility", profileVisibility);
  }, [profileVisibility]);


  // Handle avatar file upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setValue("avatar", reader.result); // Set avatar in form state
        dispatch(setAvatar(reader.result)); // Dispatch avatar to Redux store
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  // Add an empty tag to the tags list
  const addTag = () => setTags((prev) => [...prev, ""]);

  // Add an empty potential interest tag
  const addPotentialTag = () => setPotentialTags((prev) => [...prev, ""]);

  // Update a tag value in the tags list
  const updateTags = (value, index, tagSetter, tagList) => {
    const updatedTags = [...tagList];
    updatedTags[index] = value.trim();
    tagSetter(updatedTags); // Update the state with the new tag value
  };


  // Remove a tag from the tags list
  const removeTag = (index, tagSetter, tagList) => {
    const updatedTags = tagList.filter((_, i) => i !== index);
    tagSetter(updatedTags); // Update the state with the tag removed
  };

  // Add a new empty link field
  const addLinkField = () => {
    setLinks((prev) => [...prev, { siteName: "", link: "" }]);
  };

  // Update a specific field in a link object
  const updateLink = (value, index, field) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks); // Update the state with the updated link
  };


   // Remove a link from the links list
  const removeLink = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks); // Update the state with the link removed
  };

  // Handle form submission
  const onSubmit = (data) => {
    const updatedProfile = {
      ...data, // Include form data
      tags,
      potentialTags,
      links,
      profileVisibility,
    };

    console.log("Updated Profile Data:", updatedProfile);
  
    localStorage.setItem("profile", JSON.stringify(updatedProfile)); // Save to localStorage
  
    alert("Profile saved successfully!"); // Notify user
  };


  return (
    <div className={s.mainContainer}>
      {/* Left: CreateFiles */}
      <div className={s.leftContainer}>
        <CreateFiles /> {/* Component for managing project and task files */}
      </div>

      {/* Right: ProfileForm */}
      <div className={s.formContainer}>
        <div className={s.profileForm}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Avatar */}
            <div
              className={s.avatarContainer}
              onClick={() => fileInputRef.current.click()} // Trigger file input click
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" className={s.avatarImage} />
              ) : (
                <TbCameraPlus className={s.avatarIcon} />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef} // Reference to hidden file input
              style={{ display: "none" }} // Hide file input
              onChange={handleAvatarChange} // Handle avatar upload
            />

            {/* Form Fields */}
            <div className={s.formField}>
              <input placeholder="Name" {...register("name", { required: "The field is required.",
                minLength: {
                  value: 2,
                  message: "Min. of 2 characters required."
                }, 
                maxLength: {
                  value: 50,
                  message: "Max. of 50 characters allowed."
                }, 
                pattern: {
                  value: /^[A-Za-zА-Яа-яёЁ\s-]+$/, 
                  message: "Only letters, spaces, and hyphens are allowed."
                }
              }
            
              )} />
            </div>
            <div className={s.errors}>
            {errors.name && <p> <BiErrorCircle/> {errors.name?.message}</p>}
           
            </div>


            <div className={s.formField}>
              <input
                placeholder="Lastname"
                {...register("lastname", { required: "The field is required.",
                  minLength: {
                    value: 2,
                    message: "Min. of 2 characters required."
                  }, 
                  maxLength: {
                    value: 50,
                    message: "Max. of 50 characters allowed."
                  }, 
                  pattern: {
                    value: /^[A-Za-zА-Яа-яёЁ\s-]+$/, // Разрешены буквы, пробелы и дефис
                    message: "Only letters, spaces, and hyphens are allowed."
                  }
                 })}
              />
            </div>

            <div className={s.errors}>
            {errors.lastname && <p> <BiErrorCircle/> {errors.lastname?.message}</p>}
           
            </div>


            <div className={s.formField}>
              <input placeholder="Job Title" {...register("jobTitle", {required: false,
                maxLength: {
                  value: 100,
                  message: "Max. of 100 characters allowed."
                },
                pattern: {
                  value: /^[A-Za-zА-Яа-яёЁ0-9\s]+$/, 
                  message: "Only letters, numbers, and spaces are allowed."
                }
              })} />
            </div>
            <div className={s.errors}>
            {errors.jobTitle && <p> <BiErrorCircle/> {errors.jobTitle?.message}</p>}
            </div>


            <div className={s.formField}>
              <input placeholder="Phone" {...register("phone", { required: "The field is required.", 
                pattern: {
                  value: /^\+\d{10,14}$/, 
                  message: "Phone number must be in the format +<country code><number> (e.g., +79999999999)."
                }


               })} />
            </div>
            <div className={s.errors}>
            {errors.phone && <p> <BiErrorCircle/> {errors.phone?.message}</p>}
            </div>

            
            <div className={s.formField}>
              <input placeholder="Email" {...register("email", { required: "The field is required.",
               pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                message: "Invalid email format. Please enter a valid email address."
              },
              maxLength: {
                value: 320, 
                message: "Email must be less than 320 characters."
              }
               })} />
            </div>
            <div className={s.errors}>
            {errors.email && <p> <BiErrorCircle/> {errors.email?.message}</p>}
            </div>


            <div className={s.formField}>
              <input placeholder="Address" {...register("address", {required: false,
                maxLength: {
                  value: 200, 
                  message:  "Max. of 200 characters allowed."
                },
                pattern: {
                  value: /^[A-Za-zА-Яа-яёЁ0-9\s,.-]+$/, 
                  message: "Only letters, numbers, commas, dots, hyphens, and spaces are allowed."
                }
              })} />
            </div>
            <div className={s.errors}>
            {errors.address && <p> <BiErrorCircle/> {errors.address?.message}</p>}
            </div>

            <div className={s.formField}>
              <input placeholder="Pitch" {...register("pitch")} />
            </div>

            {/* Radio Buttons */}
            <div className={s.formField}>
              <p>Show your profile in Launchpad?</p>
              <div className={s.radioGroup}>
                <label className={s.radioLabel}>
                  <input
                    type="radio"
                    value="Private"
                    checked={profileVisibility === "Private"}
                    onChange={() => setProfileVisibility("Private")}
                  />
                  Private
                </label>
                <label className={s.radioLabel}>
                  <input
                    type="radio"
                    value="Public"
                    checked={profileVisibility === "Public"}
                    onChange={() => setProfileVisibility("Public")}
                  />
                  Public
                </label>
              </div>
            </div>

            {/* The scopes of your interest */}
                      <div className={s.formField}>
            <div className={s.formFieldLinks}>
              <p>The scopes of your interest:</p>
              {!tags.length && (
                <button type="button" className={s.addButton} onClick={addTag}>
                  +
                </button>
              )}
            </div>
            <div className={s.tagsContainer}>
              {tags.map((tag, index) =>
                tag === "" ? (
                  <input
                    key={`scope-input-${index}`}
                    type="text"
                    placeholder="Add a tag"
                    className={s.tagInput}
                    autoFocus
                    maxLength={30} 
                    onBlur={(e) => {
                      const newTag = e.target.value.trim();
                      if (newTag) {
                        if (!/^[A-Za-zА-Яа-яёЁ0-9\s,.]+$/.test(newTag)) {
                          alert("Tags can only contain letters, numbers, spaces, commas, and dots.");
                          return;
                        }
                        updateTags(newTag, index, setTags, tags);
                      } else {
                        removeTag(index, setTags, tags);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const newTag = e.target.value.trim();
                        if (newTag) {
                          if (!/^[A-Za-zА-Яа-яёЁ0-9\s,.]+$/.test(newTag)) {
                            alert("Tags can only contain letters, numbers, spaces, commas, and dots.");
                            return;
                          }
                          updateTags(newTag, index, setTags, tags);
                        } else {
                          removeTag(index, setTags, tags);
                        }
                      }
                    }}
                  />
                ) : (
                  <span key={index} className={s.tag}>
                    {tag}
                    <button
                      type="button"
                      className={s.removeTag}
                      onClick={() => removeTag(index, setTags, tags)}
                    >
                      ×
                    </button>
                  </span>
                )
              )}
              {tags.length > 0 && tags.length < 10 && ( 
                <button type="button" className={s.addButton} onClick={addTag}>
                  +
                </button>
              )}
            </div>
          </div>


           {/* Potential interests */}
                <div className={s.formField}>
                  <div className={s.formFieldLinks}>
                    <p>Potential interests:</p>
                    {!potentialTags.length && (
                      <button type="button" className={s.addButton} onClick={addPotentialTag}>
                        +
                      </button>
                    )}
                  </div>
                  <div className={s.tagsContainer}>
                    {potentialTags.map((tag, index) =>
                      tag === "" ? (
                        <input
                          key={`potential-input-${index}`}
                          type="text"
                          placeholder="Add a tag"
                          className={s.tagInput}
                          autoFocus
                          maxLength={30} 
                          onBlur={(e) => {
                            const newTag = e.target.value.trim();
                            if (newTag) {
                              if (!/^[A-Za-zА-Яа-яёЁ0-9\s,.]+$/.test(newTag)) {
                                alert("Tags can only contain letters, numbers, spaces, commas, and dots.");
                                return;
                              }
                              updateTags(newTag, index, setPotentialTags, potentialTags);
                            } else {
                              removeTag(index, setPotentialTags, potentialTags);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const newTag = e.target.value.trim();
                              if (newTag) {
                                if (!/^[A-Za-zА-Яа-яёЁ0-9\s,.]+$/.test(newTag)) {
                                  alert("Tags can only contain letters, numbers, spaces, commas, and dots.");
                                  return;
                                }
                                updateTags(newTag, index, setPotentialTags, potentialTags);
                              } else {
                                removeTag(index, setPotentialTags, potentialTags);
                              }
                            }
                          }}
                        />
                      ) : (
                        <span key={index} className={s.tag}>
                          {tag}
                          <button
                            type="button"
                            className={s.removeTag}
                            onClick={() => removeTag(index, setPotentialTags, potentialTags)}
                          >
                            ×
                          </button>
                        </span>
                      )
                    )}
                    {potentialTags.length > 0 && potentialTags.length < 10 && ( 
                      <button
                        type="button"
                        className={s.addButton}
                        onClick={addPotentialTag}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>

        {/* Links */}
                  <div className={s.formField}>
                    <div className={s.formFieldLinks}>
                      <p>Your links:</p>
                      {!links.length && (
                        <button type="button" className={s.addButton} onClick={addLinkField}>
                          +
                        </button>
                      )}
                    </div>
                    <div className={s.linksContainer}>
                      {links.map((linkObj, index) => (
                        <div key={index} className={s.linkRow}>
                          <input
                            type="text"
                            placeholder="Site name"
                            value={linkObj.siteName}
                            onChange={(e) => updateLink(e.target.value, index, "siteName")}
                            className={s.linkInput}
                          />
                          <input
                            type="url"
                            placeholder="Link"
                            value={linkObj.link}
                            maxLength={200} 
                            onBlur={(e) => {
                              const url = e.target.value.trim();
                              if (
                                url &&
                                !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(url) 
                              ) {
                                alert("Invalid link format. Please make sure the link starts with http:// or https://");
                              }
                            }}
                            onChange={(e) => updateLink(e.target.value, index, "link")}
                            className={s.linkInput}
                          />
                          <button
                            type="button"
                            className={s.removeLinkButton}
                            onClick={() => removeLink(index)}
                          >
                            <FaRegTrashCan />
                          </button>
                        </div>
                      ))}
                      {links.length > 0 && links.length < 10 && ( 
                        <button type="button" className={s.addButton} onClick={addLinkField}>
                          +
                        </button>
                      )}
                    </div>
                  </div>


            {/* Save Button */}
            <div className={s.buttons}>
              <button type="submit" className={s.saveButton}>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
