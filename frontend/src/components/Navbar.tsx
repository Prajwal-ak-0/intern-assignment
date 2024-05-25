import React, { useState, useRef } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import Logo from "./Logo";
import { CirclePlus } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from 'sonner';

const firebaseConfig = {
  apiKey: "AIzaSyAANgzdwU11UarseZPqm3npfYmi1KTADic",
  authDomain: "rag-gpt.firebaseapp.com",
  projectId: "rag-gpt",
  storageBucket: "rag-gpt.appspot.com",
  messagingSenderId: "440231210473",
  appId: "1:440231210473:web:932fa39dbffcfe00182f78",
  measurementId: "G-9JSF1RQ4ER",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const Navbar = () => {
  const user = useUser();

  const [file, setFile] = useState<File | null>(null);
  const [buttonText, setButtonText] = useState<string>("Add Pdf");
  const [link, setLink] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setButtonText("Upload Now"); // Update button text when a file is selected
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    const storageRef = ref(storage, `${file.name}`);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("Uploaded a file!", snapshot);
        return getDownloadURL(snapshot.ref);
      })
      .then((url) => {
        console.log("File available at", url);
        toast.success("File uploaded successfully");
        setLink(url);
        setButtonText("Add Pdf"); // Reset button text after upload
        setFile(null); // Clear the selected file
        createUser(url); // Pass the URL directly to the createUser function
      })
      .catch((error) => {
        console.error("Upload failed:", error);
        toast.error("Upload failed");
      });
  };

  const handleButtonClick = () => {
    if (file) {
      handleFileUpload();
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const createUser = async (fileLink: string) => {
    const data = {
      clerkId: user.user?.id,
      username: (user.user?.firstName + "-" + user.user?.lastName).replace(/\s+/g, '').toLowerCase(),
      email: user.user?.primaryEmailAddress?.emailAddress,
      link: fileLink, // Use the fileLink parameter
    };

    const response = await fetch("https://jubilant-spork-w6rw5v6qrwxf5ggr-8000.app.github.dev/api/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success("User created successfully");
      console.log("User created successfully");
    } else {
      console.error("Failed to create user");
      toast.error("Failed to create user");
    }
  };

  return (
    <div className="flex w-full sm:py-2 py-1 sm:px-8 justify-between shadow-md">
      <Logo />
      <div className="flex">
        <button
          className="inline-flex items-center justify-center whitespace-nowrap gap-x-2 rounded-md sm:px-4 px-2 py-2 mt-2 sm:mr-8 mr-2 hover:bg-neutral-100 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          onClick={handleButtonClick}
        >
          <CirclePlus />
          <span className="max-sm:hidden">{buttonText}</span>
        </button>
        <UserButton afterSignOutUrl="/" />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default Navbar;
