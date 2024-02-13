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
import { SignupValidationSchema } from "@/lib/validation"
import Loader from "@/components/shared/Loader";
import { useSignupUserMutation } from "@/store/api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "@/context/useUserContext";


const SignupForm = () => {
  const { setIsAuthenticated, checkAuthUser } = useUserContext(); // Get context functions


  const navigate = useNavigate();
  const [signupuser, { data, isLoading, isSuccess }] = useSignupUserMutation();



  const form = useForm<z.infer<typeof SignupValidationSchema>>({
    resolver: zodResolver(SignupValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      collegeName: "",
      password: "",
      phoneNumber: ""
    },
  })
  // 2. Define a submit handler.
  async function handleSignup(values: z.infer<typeof SignupValidationSchema>) {
 
     const session= await signupuser({ ...values });
     if ('error' in session && 'status' in session.error) {
      const { error } = session;
      if(error.status===400){
          alert("Email already exists sign in")
      }else{
          alert("Sign up faild , try again.")
      }
       return;
  }

  }
  useEffect(() => {
    if (isSuccess) {
      const { token: authToken } = data;
      localStorage.setItem('token', authToken);
      setIsAuthenticated(true);
      checkAuthUser();
      navigate("/");

    }

  }, [isSuccess, data, navigate, setIsAuthenticated,checkAuthUser])


  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col md:mt-40 mb-9 pb-8"  >
        {/*        <img src="assets/images/logo.svg" width={300}  alt="ClubHubb" />*/}
        <h1 className="font-bold text-2xl md:text-4xl" style={{ color: "#877EFF", fontSize: "3.2rem", marginTop: 60, }}>Clubhubb</h1>

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Clubhubb, Please enter your details
        </p>
        <p className="text-small-regular text-light-2 text-center mt-2">
          Already have an account?
          <Link
            to="/sign-in"
            className="text-primary-500 text-small-semibold ml-1">
            Log in
          </Link>

        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4">


          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
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
            name="collegeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">college name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Phone Number</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
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
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
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
            ) : "Sign up"}
          </Button>




        </form>

      </div>
    </Form>
  )
}

export default SignupForm;
