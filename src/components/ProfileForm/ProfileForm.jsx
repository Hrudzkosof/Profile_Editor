import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { TbCameraPlus } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import { setAvatar } from "../../reducers/profileReducer";
import s from "./ProfileForm.module.css";
import CreateFiles from "../CreateFiles/CreateFiles";

export default function ProfileForm() {
  const profile = useSelector((state) => state.profile); // Get profile data from Redux state
  const dispatch = useDispatch(); // Dispatch actions to Redux store


  const [tags, setTags] = useState([]); // State for managing user tags
  const [potentialTags, setPotentialTags] = useState([]); // State for managing potential interests
  const [links, setLinks] = useState([]); // State for managing external links
  const [profileVisibility, setProfileVisibility] = useState("Private"); // State for profile visibility (Private/Public)

  const { register, setValue, watch, reset, handleSubmit } = useForm({
    defaultValues: profile, // Set initial form values to Redux profile data
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
      ...data, // Form data
      tags,
      potentialTags,
      links,
      profileVisibility,
    };
    localStorage.setItem("profile", JSON.stringify(updatedProfile)); // Save profile to localStorage
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
              <input placeholder="Name" {...register("name", { required: true })} />
            </div>
            <div className={s.formField}>
              <input
                placeholder="Lastname"
                {...register("lastname", { required: true })}
              />
            </div>
            <div className={s.formField}>
              <input placeholder="Job Title" {...register("jobTitle")} />
            </div>
            <div className={s.formField}>
              <input placeholder="Phone" {...register("phone", { required: true })} />
            </div>
            <div className={s.formField}>
              <input placeholder="Email" {...register("email", { required: true })} />
            </div>
            <div className={s.formField}>
              <input placeholder="Address" {...register("address")} />
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
                      onBlur={(e) => {
                        const newTag = e.target.value.trim();
                        if (newTag) {
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
                {tags.length > 0 && (
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
                      onBlur={(e) => {
                        const newTag = e.target.value.trim();
                        if (newTag) {
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
                        onClick={() =>
                          removeTag(index, setPotentialTags, potentialTags)
                        }
                      >
                        ×
                      </button>
                    </span>
                  )
                )}
                {potentialTags.length > 0 && (
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
                {links.length > 0 && (
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
