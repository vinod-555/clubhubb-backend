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
import Loader from "@/components/shared/Loader";
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



    const [registerevent] = useRegisterEventMutation();
    const [teamSize, setTeamSize] = useState(0);
    useEffect(() => {
        if (post.maxSize === 1) {
            setTeamSize(1);
        }
    }, [post.maxSize]);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );

    const [additionalInfo, setAdditionalInfo] = React.useState<Record<string, string>>(
        requiredInfoOfStudent.reduce((acc, question) => {
            return { ...acc, [question]: "" };
        }, { name: "", email: "" } as Record<string, string>)
    );
 
    const [registrationStatus, setRegistrationStatus] = React.useState<
        "pending" | "success"
    >(registrationState);

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
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
     };

    const handleClose = () => {
        if(post?.maxSize>1){
            setTeamSize(0);
        }
       fetchData();
 
        setAnchorEl(null);
 


    };

    const handleAdditionalInfoChange =
        (question: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setAdditionalInfo((prevInfo) => ({
                ...prevInfo,
                [question]: event.target.value,
            }));
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

            const session = await registerevent(registrationData);
            if ("error" in session) {
                 alert("Error while adding your information");
                return;
            }
            if ('data' in session) {
                setRegistrationStatus("success");
                navigate('/profile')
                window.location.reload();

            }

            // Uncomment the following line when you are ready to submit the form
            // await registerevent(registrationData);

            // Update the registration status upon successful registration
            // setRegistrationStatus("success");
        } catch (error) {
            alert("Error registering event:");
        }

        handleClose();
    };

    async function register() {
        const registrationData = {
            eventId,
            additionalInfo,
            teamSize
        };
 

        try {
            const session = await registerevent(registrationData);
            handleClose();


            if ("error" in session) {
                alert("Error while adding your information");
                return;
            }
            if ('data' in session) {
                setRegistrationStatus("success");
                fetchData();

                // Wait for 5 seconds before navigating to '/profile'
                setTimeout(() => {
                    navigate('/profile');
                    
                    // Reload the page after navigation
                    window.location.reload();
                }, 3000);
             }
        } catch (error) {
            alert("Error  in registering event");
        }
    }
    const [loading, setLoading] = useState(false);
    const [successPayment, setSuccessPayment] = useState(false);



    const handleOpenRazorpay = (data: RazorpayResponse) => {
 
        const options: RazorpayOptions = {
            key: "", //key should be given
            amount: Number((data.amount)),
            currency: data.currency,
            order_id: data.id,
            name: "ClubHub",
            description: "Event Registeration", //
            handler: function (response: RazorpayResponse) {
                setLoading(true);

                 axios
                    .post("https://clubhub-user-backend.onrender.com/api/v1/verify", {
                        response: response,
                    })
                    .then((res) => {
                        // Handle success, then proceed with the registration or other actions
                        console.log(res+"Thank You");
                         register();
                        setSuccessPayment(true); // Set success flag

                        setTimeout(() => {
                            }, 3000);
                    })
                    .catch((error) => {
                        console.log(error)
                        alert("Error in payment");
                        setSuccessPayment(false); // Set success flag to false in case of error
                    })
                    .finally(() => {
                        setLoading(false); // Whether it succeeds or fails, set loading to false
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
    const _data = { amount: ((amount * teamSize)+1)};
         try {
             const res = await axios.post(
                "https://clubhub-user-backend.onrender.com/api/v1/orders",
                _data
            );
 

            handleOpenRazorpay(res.data.data);
 
         } catch (err) {
            alert("error in payment");

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
                    <> {loading ? (
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
                        {successPayment ? (

                            // Render loading indicator or message
                            <>
                            
                                    <div className="p-4 m-2" style={{backgroundColor: "white" ; color:"black" }}>
                                    <p>please wait 15 sec for processing ...</p>
                                    <p>Thank You!!!</p>
                                    {/* Add tick icon here */}
                                  </div>
                            </>

                        ) : (
                            <div>
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
                                  <div className="flex flex-row gap-2">
                                    <Button
                                        variant="contained"
                                        className="shad-button_primary"
                                        onClick={handlePayment}
                                    >
                                    {loading?(
                                        <>
                                                <Loader/> please wait...
                                        </>
                                    ):(
                                            <>
                                        PAY {(amount * teamSize)+1}
                                            </>    
                                        )}
                                        </Button>
                                      <div style={{color:"red"}}>
                                      <p>Including service charge</p>
                                      </div>
                                      
                                  </div>
                                 )}
                            </div>
                        )}
                    </div>
                </Popover>
            </div>
        </ThemeProvider>
    );
}
