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
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotpasswordValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { useForgotpasswordMutation } from "@/store/api/authApi";
import { Link, useNavigate } from "react-router-dom";

interface ForgotPasswordFormValues {
    clubEmail: string;
}

const ForgotPasswordForm = () => {
    const [forgotpassword, { isLoading }] = useForgotpasswordMutation();
     const navigate = useNavigate();

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotpasswordValidationSchema),
        defaultValues: {
            clubEmail: "",
        },
    });

    // Define a submit handler.
    async function onSubmit(values: ForgotPasswordFormValues) {
        // Check if email is empty
        if (!values.clubEmail.trim()) {
            form.setError("clubEmail", {
                type: "manual",
                message: "Email is required",
            });
            return;
        }

        try {
            // Assuming the backend sends an email with the OTP, so we pass the email to the OTP verification component
            const ResetCode = await forgotpassword({ ...values });
             if('error' in ResetCode){
                console.log(ResetCode.error)
            }
             navigate("/verify-otp", { state: { email: values.clubEmail } });
        } catch (error) {
            alert("error :( reload page");
 
        }
    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                <h1 className="font-bold text-2xl md:text-4xl">Clubhubb</h1>

                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                    Forgot Password
                </h2>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5 w-full mt-4"
                >
                    <FormField
                        control={form.control}
                        name="clubEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">
                                    Enter email to RESET
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        className="shad-input"
                                        {...field}
                                        value={field.value.toLowerCase()} // Convert to lowercase here
                                    />
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.clubEmail?.message}
                                </FormMessage>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="shad-button_primary">
                        {isLoading ? (
                            <div className="flex-center gap-2">
                                <Loader /> Loading...
                            </div>
                        ) : (
                            "Send email"
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

export default ForgotPasswordForm;
