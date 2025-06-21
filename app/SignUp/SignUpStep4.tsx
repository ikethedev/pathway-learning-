import React, { useState } from "react";

type ClassForm = {
  classTitle: string;
  useJoinCode: boolean;
  roster: any[];
  classCode: string;
  autoAccounts: any[];
};

export default function SignUpStep4() {
  function generateClassCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const [classInfo, setClassInfo] = useState<ClassForm>({
    classTitle: "",
    useJoinCode: true,
    roster: [],
    classCode: generateClassCode(),
    autoAccounts: [],
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setClassInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      console.log("CSV content:", text);
      // Parse CSV here and update roster
    };
    reader.readAsText(file);
  }

  function handleOptionClick(option: string) {
    console.log("Selected:", option);
    setDropdownOpen(false);

    if (option === "Upload CSV") {
      document.getElementById("csv-upload")?.click();
    }

    // Add LMS integration hook here later
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Submitting class info:", classInfo);
    // Call backend or advance step here
  }

  return (
    <div>
        <p>Step 4 of 4</p>
      <h1>Set up your first class</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="classTitle"
          placeholder="Class name"
          required
          value={classInfo.classTitle}
          onChange={handleChange}
        />

        <div onClick={() => setDropdownOpen(!dropdownOpen)}>
          Import Options ▼
        </div>

        {dropdownOpen && (
          <div>
            {["Google Classroom", "Canvas", "Upload CSV"].map((option) => (
              <div key={option} onClick={() => handleOptionClick(option)}>
                {option}
              </div>
            ))}
          </div>
        )}

        {/* Hidden CSV input */}
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleCSVUpload}
        />
      </form>
    </div>
  );
}
