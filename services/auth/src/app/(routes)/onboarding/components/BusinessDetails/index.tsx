import { useState, useEffect, useReducer, ReactNode } from "react";
import { FiMail, FiPhone, FiMessageSquare, FiImage } from "react-icons/fi";
import { PiBuildings } from "react-icons/pi";
import { DetailsCard } from "./DetailsCard";
import { QuestionHeader } from "./components/QuestionHeader";
import { FileUpload } from "./components/FileUpload";
import { TextInput } from "./components/TextInput";

// Interfaces
interface BusinessDetailsProps {
    type: "individual" | "company";
    existingEmail?: string;
    onNext: (details: BusinessDetailsData) => void;
    disabled?: boolean;
}

export interface BusinessDetailsData {
    name: string;
    email: string;
    phone: string;
    description?: string;
    logo?: string;
    type: "individual" | "company";
    stage?: "directors" | "verification";
    verified?: boolean;
    companyVerified?: boolean;
    phoneVerified?: boolean;
}

interface Question<K extends keyof BusinessDetailsData = keyof BusinessDetailsData> {
    key: K;
    question: string;
    placeholder: string;
    icon: ReactNode;
    multiline?: boolean;
    isFile?: boolean;
}

// Reducer for state management
const reducer = (state: BusinessDetailsData, action: { key: keyof BusinessDetailsData; value: string }) => ({
    ...state,
    [action.key]: action.value,
});

export function BusinessDetails({ type, existingEmail, onNext, disabled = false }: BusinessDetailsProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [showBusinessCard, setShowBusinessCard] = useState(false);

    const questions: Question[] = [
        {
            key: "name",
            question: type === "company" ? "What's your company's name?" : "What's your full name?",
            placeholder: type === "company" ? "e.g., Acme Corporation" : "e.g., John Doe",
            icon: <PiBuildings className="w-5 h-5" />,
        },
        ...(type === "company"
            ? [
                  {
                      key: "logo" as keyof BusinessDetailsData,
                      question: "Upload your company logo",
                      placeholder: "Upload logo (optional)",
                      icon: <FiImage className="w-5 h-5" />,
                      isFile: true,
                  },
                  {
                      key: "description" as keyof BusinessDetailsData,
                      question: "What does your company do?",
                      placeholder: "e.g., We provide innovative cloud solutions",
                      icon: <FiMessageSquare className="w-5 h-5" />,
                      multiline: true,
                  },
              ]
            : []),
        {
            key: "email",
            question: type === "company" ? "What's your business email?" : "What's your email address?",
            placeholder: type === "company" ? "e.g., contact@company.com" : "e.g., john@example.com",
            icon: <FiMail className="w-5 h-5" />,
        },
        {
            key: "phone",
            question: type === "company" ? "What's your business phone?" : "What's your contact number?",
            placeholder: type === "company" ? "e.g., +1 (555) 123-4567" : "e.g., +1 (555) 987-6543",
            icon: <FiPhone className="w-5 h-5" />,
        },
    ];

    const [formState, dispatch] = useReducer(reducer, {
        name: "",
        email: existingEmail || "",
        phone: "",
        description: "",
        type,
        verified: false,
        stage: type === "company" ? "directors" : "verification",
    });

    const currentQuestion = questions[currentStep];
    const [inputValue, setInputValue] = useState(formState[currentQuestion.key]?.toString() || "");

    useEffect(() => {
        setInputValue(formState[currentQuestion.key]?.toString() || "");
    }, [currentStep, formState, currentQuestion.key]);

    // Validation
    const isCurrentStepValid = () => {
        const value = inputValue.trim();
        if (!value) return false;

        switch (currentQuestion.key) {
            case "email":
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case "phone":
                return /^\+?[\d\s-]{10,}$/.test(value);
            default:
                return value.length > 1;
        }
    };

    const handleInputChange = (value: string) => {
        if (!disabled) setInputValue(value);
    };

    const handleNext = () => {
        if (!isCurrentStepValid() && !currentQuestion.isFile) return;

        dispatch({ key: currentQuestion.key, value: inputValue });

        if (currentStep < questions.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            setShowBusinessCard(true);
        }
    };

    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileUpload = (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }
        setUploadProgress(0);
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setUploadProgress(100);
                handleInputChange(reader.result);
                setTimeout(() => {
                    handleNext();
                }, 1000);
            }
        };
        reader.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100;
                setUploadProgress(progress);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {showBusinessCard ? (
                <div className="flex items-center justify-center">
                    <DetailsCard
                        details={formState}
                        onConfirm={() => onNext(formState)}
                        type={type}
                        disabled={disabled}
                    />
                </div>
            ) : (
                <div className="flex-1 space-y-4">
                    <QuestionHeader
                        icon={currentQuestion.icon}
                        question={currentQuestion.question}
                        placeholder={currentQuestion.placeholder}
                    />

                    {currentQuestion.isFile ? (
                        <FileUpload
                            inputValue={inputValue}
                            uploadProgress={uploadProgress}
                            onFileChange={handleFileUpload}
                            disabled={disabled}
                        />
                    ) : (
                        <TextInput
                            value={inputValue}
                            onChange={handleInputChange}
                            onNext={handleNext}
                            isValid={isCurrentStepValid()}
                            disabled={disabled}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
