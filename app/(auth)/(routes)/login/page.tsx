"use client"

import React, { useState } from 'react'
import { Rock_Salt } from 'next/font/google'
import { cn } from '@/app/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import axios from "axios"


const logo = Rock_Salt({
    weight: '400',
    subsets: ["latin"]
})

type VariantType = 'Login' | 'Register'

const Login = () => {

    const [variant, setVariant] = useState<VariantType>('Login')
    const [loading, setLoading] = useState<boolean>(false)

    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [errorMessage, setErrorMessage] = useState("")

    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [matchingPassword, setMatchingPassword] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const router = useRouter()

    const toggleVariant = () => {
        if (variant === 'Login') {
            setLoading(true);
            setVariant('Register');
            setLoading(false);
        } else {
            setLoading(true);
            setVariant('Login');
            setLoading(false);
        }
    }

    const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }
    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }
    const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }
    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const confirmPasswordValue = event.target.value;
        setConfirmPassword(confirmPasswordValue);

        if (password !== "" && confirmPasswordValue !== "") {
            setMatchingPassword(confirmPasswordValue === password);
        } else {
            setMatchingPassword(false);
        }
    }

    const handleRegister = async () => {
        try {
            setLoading(true);
            if (name === "" || username === "" || email === "" || password === "" || confirmPassword === "") {
                setErrorMessage("Missing fields. Fill the required fields");
                setLoading(false);
            }
            else {
                setErrorMessage("");
                console.log(matchingPassword);
                if (matchingPassword) {
                    const res = await axios.post(`/api/register`, {

                        user_name: name,
                        username: username,
                        email: email,
                        user_password: password
                    });
                    if (res.status === 200) {
                        const result = await res.data;
                        router.push('/')
                    }
                    setLoading(false)
                }
                else {
                    setErrorMessage("Password do not match");
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error("Error while passing user detail to api", error)
        }
    }

    const handleLogin = async () => {

        try {
            setLoading(true);

            const encodedUsername = encodeURIComponent(username);
            const encodedPassword = encodeURIComponent(password);

            if (username === "" || password === "") {
                setErrorMessage("Missing details. Fill in the required fields");
                setLoading(false);
            }
            else {
                setErrorMessage("");
                const res = await fetch(`/api/login?username=${encodedUsername}&password=${encodedPassword}`, {
                    method: 'GET'
                })

                if (res.status == 200) {
                    const result = await res.json();
                    router.push('/');
                }
                if (res.status == 401) {
                    setErrorMessage('Incorrect username or password');
                }
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while posting user details while registering the user: ", error);
        }
    }


    return (
        <div className='flex items-center justify-center w-full h-full'>
            {
                variant === 'Login' && (
                    <div className='flex flex-col items-start justify-center'>
                        <h1 className={cn(`text-6xl lg:text-7xl`, logo.className)}>TaskDone</h1>
                        <div className='flex flex-col items-start justify-center bg-white rounded-xl 
                        w-full md:max-w-xl mx-auto gap-5 mt-20 p-8'>
                            {/*message */}
                            <h2 className='text-lg self-center text-[14px]'>Sign in to your account</h2>
                            {
                                errorMessage !== '' && (
                                    <p className='text-red-500'>
                                        {errorMessage}
                                    </p>
                                )

                            }
                            {/*Username */}
                            <div className='flex flex-col items-start justify-center w-full'>
                                <Label htmlFor='username'>Username</Label>
                                <Input
                                    type='text'
                                    onChange={handleUsername}
                                    name='username'
                                    required={true}
                                    className='mt-3' />
                            </div>
                            {/*Password */}
                            <div className='flex flex-col items-start justify-center w-full'>
                                <Label htmlFor='password'>Password</Label>
                                <Input name='password'
                                    onChange={handlePassword}
                                    required={true}
                                    type={showPassword ? 'text' : 'password'}
                                    className='mt-3'
                                />
                            </div>
                            {/*Login button */}
                            <Button type='submit'
                                variant='signin'
                                disabled={loading}
                                onClick={handleLogin} >
                                Login
                            </Button>
                            {/*Register */}
                            <div className='flex flex-col lg:flex-row gap-2 lg:gap-0 items-center justify-between 
                            text-[14px] w-full text-gray-600'>
                                <h2>New to TaskDone?</h2>
                                <span className='underline cursor-pointer'
                                    aria-disabled={loading}
                                    onClick={toggleVariant}
                                >
                                    Register yourself with us
                                </span>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                variant === 'Register' && (
                    <div className='flex flex-col items-start justify-center'>
                        <h1 className={cn(`text-6xl lg:text-7xl`, logo.className)}>TaskDone</h1>
                        <div className='flex flex-col items-start justify-center bg-white rounded-xl 
                        w-full md:max-w-xl mx-auto gap-5 mt-14 p-8'>
                            <h2 className='text-lg self-center text-[14px]'>Become part of our family</h2>
                            {/*Missing detail message */}
                            {
                                errorMessage !== "" && (
                                    <p className='text-red-500'>
                                        {errorMessage}
                                    </p>
                                )
                            }
                            {/*Name */}
                            <div className='flex flex-col items-start justify-center w-full'>
                                <Label htmlFor='name'>Name</Label>
                                <Input type='text' name='name' value={name}
                                    placeholder='John Doe'
                                    onChange={handleName}
                                    required
                                    className='mt-3'
                                />
                            </div>
                            {/*Username */}
                            <div className='flex flex-col items-start justify-center w-full'>
                                <Label htmlFor='username'>Username</Label>
                                <Input type='text' name='username'
                                    value={username}
                                    onChange={handleUsername}
                                    placeholder='johndoe'
                                    required
                                    className='mt-3'
                                />
                            </div>
                            {/*Email */}
                            <div className='flex flex-col items-start justify-center w-full'>
                                <Label htmlFor='email'>Email</Label>
                                <Input type='email' value={email}
                                    name='email'
                                    placeholder='example@mail.com'
                                    onChange={handleEmail}
                                    required
                                    className='mt-3'
                                />

                            </div>
                            {/*Password */}
                            <div className='flex flex-col items-start justify-center w-full'>
                                <Label htmlFor='password'>Password</Label>
                                <Input type='password'
                                    name='password'
                                    value={password}
                                    onChange={handlePassword}
                                    required
                                    className='mt-3'
                                />
                            </div>
                            {/*Confirm Password */}
                            <div className='flex flex-col items-start justify-center w-full'>
                                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                                <Input type='password'
                                    name='confrimPassword'
                                    value={confirmPassword}
                                    onChange={handleConfirmPassword}
                                    required
                                    className='mt-3'
                                />
                            </div>
                            {/*Conditional to check if password matches */}
                            {
                                matchingPassword === false && (
                                    <p className="text-red-500">Passwords do not match</p>
                                )
                            }
                            {/*Register Button */}
                            <Button type='submit' variant='signin' disabled={loading} onClick={handleRegister}>
                                Register
                            </Button>
                            {/*Login */}
                            <div className='flex items-center justify-center gap-5 text-[14px] w-full text-gray-600'>
                                <h2>Already have account?</h2>
                                <span className='underline cursor-pointer'
                                    aria-disabled={loading}
                                    onClick={toggleVariant}
                                >
                                    Login
                                </span>
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default Login