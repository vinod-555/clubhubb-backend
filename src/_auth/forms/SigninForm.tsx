import { z } from "zod";
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { SigninValidationSchema } from "@/lib/validation"
import Loader from "@/components/shared/Loader";
import { useSigninUserMutation } from "@/store/api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "@/context/useUserContext";

const SigninForm = () => {

    const navigate = useNavigate();
    const [signinuser, { data, isLoading, isSuccess }] = useSigninUserMutation();
    const { setIsAuthenticated, checkAuthUser } = useUserContext(); // Get context functions

 

    const form = useForm<z.infer<typeof SigninValidationSchema>>({
        resolver: zodResolver(SigninValidationSchema),
        defaultValues: {
            emailOrUsername: "",
            password: ""
        },
    })
    // 2. Define a submit handler.
    async function handleSignin(values: z.infer<typeof SigninValidationSchema>) {
        const session = await signinuser({ ...values });
         if ('error' in session && 'status' in session.error) {
            const { error } = session;
            if(error.status===404){
                alert("Invalid email Sign up")
            }else{
                alert("Invalid password , try again.")
            }
             return;
        }

    }

    useEffect(() => {
        if (isSuccess) {
            const { token: authToken } = data;
            localStorage.setItem('token', authToken);
            setIsAuthenticated(true);

            // Perform additional actions after successful login
            checkAuthUser();
            navigate("/");

        }

    }, [isSuccess, data, navigate, setIsAuthenticated, checkAuthUser])


    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                {/*        <img src="assets/images/logo.svg" width={300}  alt="ClubHubb" />*/}
                <h1
                    className="font-bold text-2xl md:text-4xl"
                    style={{ color: "#877EFF", fontSize: "2rem" }}
                >
                    Clubhubb
                </h1>

                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                    Login account
                </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">
                    To use Clubhubb, Please enter your details
                </p>

                <form
                    onSubmit={form.handleSubmit(handleSignin)}
                    className="flex flex-col gap-5 w-full mt-4"
                >
                    <FormField
                        control={form.control}
                        name="emailOrUsername"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        className="shad-input"
                                        {...field}
                                        value={field.value.toLowerCase()} // Convert to lowercase here
                                    
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="shad-form_label">
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        className="shad-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="shad-button_primary">
                        {isLoading ? (
                            <div className="flex-center gap-2">
                                <Loader /> Loading...
                            </div>
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                    <Link
                        to="/forgot-password"
                        className="text-primary-500 text-small-semibold mt-2"
                    >
                        Forgot password?
                    </Link>

                    <p className="text-small-regular text-light-2 text-center mt-2">
                        {/*  <Link
             to="/forgot-password"
             className="text-primary-500 text-small-semibold ml-1">
             Forgot pasword ?
           </Link>*/}
                        Don't have an account?
                        <Link
                            to="/sign-up"
                            className="text-primary-500 text-small-semibold ml-1"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    );
}

export default SigninForm;
