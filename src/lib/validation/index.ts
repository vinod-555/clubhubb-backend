import * as z from "zod";


export const SignupValidationSchema = z.object({
  name: z.string().min(2, { message: 'Too short' }).refine((value) => value.trim(), { message: 'Name should not contain leading or trailing whitespaces' }),
   email: z.string().email().refine((value) => value.toLowerCase(), { message: 'Email should be in lowercase' }),
  collegeName: z.string().refine((value) => value.trim(), { message: 'College name should not contain leading or trailing whitespaces' }),
  phoneNumber: z.string().refine((value) => value.trim().length === 10, {
    message: 'Phone number must be 10 digits long',
  }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }).refine((value) => {
    // Check if password contains at least one uppercase, one lowercase, and one digit
    return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
  }, {
    message: 'Password should contain at least one uppercase letter, one lowercase letter, and one digit',
  }),
});
  
export const SigninValidationSchema= z.object({
   
  emailOrUsername:z.string().email(),
  password:z.string().min(8,{message:"Password must be at least 8 charecters "})

})
export const forgotpasswordValidationSchema= z.object({
   
  clubEmail:z.string().email(),
 
})

export const RegisterValidationSchema= z.object({
   
  email:z.string().email(),
  name:z.string()

})


  
