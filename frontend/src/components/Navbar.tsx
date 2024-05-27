import React, { useState, useRef } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import Logo from "./Logo";
import { CirclePlus, UploadCloudIcon } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";

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
  const { user } = useUser();

  const [file, setFile] = useState<File | null>(null);
  const [buttonText, setButtonText] = useState<string>("Add Pdf");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setButtonText("Upload Now");
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
        setButtonText("Add Pdf");
        setFile(null);
        createDocument(user?.id ?? "", url);
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

  const createDocument = async (clerkId: string, link: string) => {
    if (!clerkId) {
      toast.error("User's clerkId not found");
      console.error("User's clerkId not found");
      return;
    }

    const response = await fetch(`http://localhost:8000/api/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clerkId, link }), // send clerkId and link
    });

    if (response.ok) {
      toast.success("Document created successfully");
      console.log("Document created successfully");
    } else {
      const errorData = await response.json();
      console.error("Failed to create document:", errorData);
      toast.error("Failed to create document");
    }
  };

  return (
<div className="fixed top-0 w-full sm:py-2 py-1 sm:px-8 px-4 bg-white shadow-md z-10">
      <div className="flex justify-between">
        <Logo />
        <div className="flex">
          <button
            className="inline-flex items-center justify-center whitespace-nowrap gap-x-2 rounded-md sm:px-4 px-2 py-2 mt-2 sm:mr-8 mr-2 hover:bg-neutral-100 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            onClick={handleButtonClick}
          >
            {file ? <UploadCloudIcon /> : <CirclePlus />}
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
    </div>
  );
};

export default Navbar;
