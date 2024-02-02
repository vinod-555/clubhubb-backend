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
import { useResetPasswordMutation } from "@/store/api/authApi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ResetPasswordFormValues {
    password: string;
    confirmPassword: string;
}

const ResetPassword = () => {
    const location = useLocation();
    const email = location?.state?.email;
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const navigate = useNavigate();
    const form = useForm<ResetPasswordFormValues>({
        // Define validation schema for the form
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    // Register custom validation rule to check if passwords match
    form.register("confirmPassword", {
        validate: (value) =>
            value === form.getValues("password") || "Passwords do not match",
    });

    const onSubmit = async (values: ResetPasswordFormValues) => {
        try {
            const response = await resetPassword({
                email: email,
                password: values.password,
            });

            if ("data" in response) {
                // Successful response
                console.log("Password reset successfully");
                navigate("/sign-in");
            } else if ("error" in response) {
                // Error response
                console.error(response.error);
                // Handle the error case, e.g., display an error message
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                <h1 className="font-bold text-2xl md:text-4xl">Clubhubb</h1>

                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                    Reset Password
                </h2>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5 w-full mt-4"
                >
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">
                                    Enter New Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        className="shad-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.password?.message}
                                </FormMessage>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">
                                    Confirm Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        className="shad-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage>
                                    {
                                        form.formState.errors?.confirmPassword
                                            ?.message
                                    }
                                </FormMessage>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="shad-button_primary">
                        {isLoading ? (
                            <div className="flex-center gap-2">
                                <Loader /> Resetting...
                            </div>
                        ) : (
                            "Reset Password"
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

export default ResetPassword;
