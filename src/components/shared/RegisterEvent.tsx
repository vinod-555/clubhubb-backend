import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Input from "@mui/material/Input";
import { useUserContext } from "@/context/useUserContext";
import { useRegisterEventMutation } from "@/store/api/eventApi";
import React, { useEffect, useState } from "react";
import { useMediaQuery, createTheme, ThemeProvider } from "@mui/material";
import axios from "axios";
import QRCodeDisplay from "../../_root/pages/QRCodeDisplay";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TeamDetails from "./TeamDetails";

type RazorpayOptions = {
    key: string | undefined;
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description: string;
    handler: (response: RazorpayResponse) => void;
    // Add other necessary properties
};
type Post = {



    requiredInfoOfStudent: string[];
    registeredUserIds: { userId: string }[];
    maxSize: number;
    minSize: number;
};

type RegisterEventProps = {
    eventId: string;
    requiredInfoOfStudent: string[];
    amount: number;
    fetchData: () => void;
    registrationState: "pending" | "success" | (() => "pending" | "success");
    post: Post;
};


declare global {
    interface Window {
        Razorpay: {
            new(options: RazorpayOptions): {
                open(): void;
                // Add other necessary methods or properties for Razorpay
            };
        };
    }
}


type RazorpayResponse = {
    id: string;
    amount: number;
    currency: string;
    // Add other properties as needed
};

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "black",
            paper: "#222",
        },
        primary: {
            main: "#f84464",
        },
        text: {
            primary: "#fff",
        },
    },
});




export default function RegisterEvent(props: RegisterEventProps) {


    const { user } = useUserContext();
    const navigate = useNavigate();
    const { eventId } = props;
    const { requiredInfoOfStudent } = props;
    const { amount } = props;
    const { registrationState } = props
    const { fetchData } = props;
    const { post } = props
    console.log(post)
    console.log(amount + "AMOUNT");
    console.log(post.minSize)
    console.log(post.maxSize)


    const [registerevent, { isLoading }] = useRegisterEventMutation();
    const [teamSize, setTeamSize] = useState(0);
    console.log(teamSize)
    useEffect(() => {
        if (post.maxSize === 1) {
            setTeamSize(1);
        }
    }, [post.maxSize]);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );

    const [additionalInfo, setAdditionalInfo] = React.useState<
        Record<string, string>
    >(
        requiredInfoOfStudent.reduce((acc, question) => {
            return { ...acc, [question]: "" };
        }, {} as Record<string, string>)
    );
    console.log(additionalInfo)
    const [registrationStatus, setRegistrationStatus] = React.useState<
        "pending" | "success"
    >(registrationState);
    console.log(registrationStatus)

    const isMobile = useMediaQuery("(max-width: 600px)");
    const mobilePopoverPosition = { top: 400, left: 220 };
    const laptopPopoverPosition = { top: 400, left: 870 };
    const popoverPosition = isMobile
        ? mobilePopoverPosition
        : laptopPopoverPosition;

    useEffect(() => {
        fetchData();
        setAdditionalInfo((prevInfo) => ({
            ...prevInfo,
            name: user.name || "",
            email: user.email || "",
        }));
    }, []);
    console.log("noting")
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        console.log(anchorEl);
    };

    const handleClose = () => {
        setTeamSize(0);
        setAnchorEl(null);

    };

    const handleAdditionalInfoChange =
        (question: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            console.log(question, event)
            setAdditionalInfo((prevInfo) => ({
                ...prevInfo,
                [question]: event.target.value,
            }));
            console.log(additionalInfo)
        };


    const RegisterEventSubmit: React.MouseEventHandler<
        HTMLButtonElement
    > = async (event) => {
        event.preventDefault();

        try {
            // Check if any required field is empty
            const isAnyFieldEmpty = Object.values(additionalInfo).some(
                (field) => field === ""
            );

            if (isAnyFieldEmpty) {
                alert("Please fill in all required fields");
                return;
            }

            // Perform the registration
            const registrationData = {
                eventId,
                additionalInfo,
                teamSize
            };

            console.log(registrationData);
            const session = await registerevent(registrationData);
            console.log(session)



            if ("error" in session) {
                alert("Error while adding your information");
                return;
            }
            if ('data' in session) {
                console.log("event")

                setRegistrationStatus("success");
                navigate('/profile')
                window.location.reload();

            }
            // Uncomment the following line when you are ready to submit the form
            // await registerevent(registrationData);

            // Update the registration status upon successful registration
            // setRegistrationStatus("success");
        } catch (error) {
            console.error("Error registering event:", error);
        }

        handleClose();
    };

    async function register() {
        const registrationData = {
            eventId,
            additionalInfo,
            teamSize
        };

        console.log(registrationData);

        try {
            const session = await registerevent(registrationData);
            console.log(session)
            handleClose();


            if ("error" in session) {
                alert("Error while adding your information");
                return;
            }
            if ('data' in session) {
                setRegistrationStatus("success");
                console.log("session")
                fetchData();
                console.log("evemtg")
                navigate('/profile')
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleOpenRazorpay = (data: RazorpayResponse) => {
        const options: RazorpayOptions = {
            key: "", //key should be given
            amount: Number((data.amount)),
            currency: data.currency,
            order_id: data.id,
            name: "ClubHub",
            description: "Event Registeration", //
            handler: function (response: RazorpayResponse) {
                console.log(response, "34");
                axios
                    .post("https://clubhubb-user.onrender.com/api/v1/verify", {
                        response: response,
                    })
                    .then((res) => {
                        console.log(res, "37");
                        register();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };



    const handlePayment = async () => {
        const isAnyFieldEmpty = Object.values(additionalInfo).some(
            (field) => field === ""
        );

        if (isAnyFieldEmpty) {
            alert("Please fill in all required fields");
            return;
        }
        const _data = { amount: amount * teamSize };
        console.log(amount);
        try {
            console.log(_data);
            const res = await axios.post(
                "http://localhost:8000/api/v1/orders",
                _data
            );
            console.log(res.data, "29");
            const session = handleOpenRazorpay(res.data.data);
            console.log(session);
        } catch (err) {
            console.log(err);
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <ThemeProvider theme={darkTheme}>
            <div>
                {registrationStatus === "pending" ? (
                    <Button
                        aria-describedby={id}
                        variant="contained"
                        className="shad-button_primary"
                        onClick={handleClick}
                    >
                        Register
                    </Button>
                ) : (
                    <> {isLoading ? (
                        <div className="flex-center gap-8">
                            <Loader /> Loading...
                        </div>

                    ) : (
                        <div className="flex flex-between">
                            <div>

                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: "#f84464", color: "white" }}
                                    disabled
                                >
                                    Registered
                                </Button>
                            </div>
                            <div>

                                <QRCodeDisplay eventId={eventId} />
                            </div>
                        </div>
                    )}
                    </>
                )}
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={popoverPosition}
                    anchorOrigin={{
                        vertical: "center",
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: "center",
                        horizontal: "center",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "black",
                            color: "white",
                            padding: 16,
                        }}
                    >
                        <Typography variant="h6">Register Event</Typography>

                        {requiredInfoOfStudent.map((question) => (
                            <FormControl key={question} fullWidth margin="normal">
                                <FormLabel>{question}</FormLabel>
                                <Input
                                    placeholder={`Enter your ${question.toLowerCase()}`}
                                    value={additionalInfo[question]}
                                    onChange={handleAdditionalInfoChange(question)}
                                    style={{ color: "white" }}
                                />
                            </FormControl>
                        ))}

                        {post?.maxSize > 1 && (
                            <TeamDetails
                                setAdditionalInfo={setAdditionalInfo}
                                minSize={post?.minSize}
                                maxSize={post?.maxSize}
                                setTeamSize={setTeamSize}
                                amount={amount}
                                teamSize={teamSize}

                            />
                        )}

                        {amount <= 0 ? (
                            <Button
                                variant="contained"
                                style={{ backgroundColor: "#f84464" }}
                                onClick={RegisterEventSubmit}
                            >
                                Submit
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                className="shad-button_primary"
                                onClick={handlePayment}
                            >
                                PAY {amount * teamSize}
                            </Button>
                        )}
                    </div>
                </Popover>
            </div>
        </ThemeProvider>
    );
}
