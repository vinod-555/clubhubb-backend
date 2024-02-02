import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";
import { useVerifyOTPMutation } from "@/store/api/authApi";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface OtpInputFormValues {
    otp: string;
}

const OtpInput = () => {
    const location = useLocation();
    const emailFromState = location?.state?.email;

    console.log("solved", emailFromState);
    const [verifyOTP, {  isLoading }] = useVerifyOTPMutation();

    const navigate = useNavigate();

    const form = useForm<OtpInputFormValues>();

    async function onSubmit(values: OtpInputFormValues) {
        try {
            // Directly use the 'email' prop from the component's props
            const response = await verifyOTP({
                email: emailFromState,
                otp: values.otp,
            });

            if ("error" in response) {
                console.error(response.error);
                form.setError("otp", {
                    type: "manual",
                    message: "Invalid OTP. Please try again.",
                });
            } else {
                console.log("OTP verified successfully");
                navigate("/reset-password", {
                    state: { email: emailFromState },
                });
            }
        } catch (error) {
            console.error(error);
            form.setError("otp", {
                type: "manual",
                message: "Invalid OTP. Please try again.",
            });
        }
    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                <h1 className="font-bold text-2xl md:text-4xl">Clubhubb</h1>

                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Verify OTP</h2>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5 w-full mt-4"
                >
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">
                                    Enter OTP
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        className="shad-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.otp?.message}
                                </FormMessage>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="shad-button_primary">
                        {isLoading ? (
                            <div className="flex-center gap-2">
                                <Loader /> Verifying...
                            </div>
                        ) : (
                            "Verify OTP"
                        )}
                    </Button>

                    <p className="text-small-regular text-light-2 text-center mt-2">
                        <Link
                            to="/sign-in"
                            className="text-primary-500 text-small-semibold ml-1"
                        >
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    );
};

export default OtpInput;
