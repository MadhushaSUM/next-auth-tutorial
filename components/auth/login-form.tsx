"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import * as z from "zod";
import { LoginSchema } from "@/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already un use with different provider" : "";

    const [success, setSuccess] = useState<string | undefined>("");
    const [error, setError] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setSuccess("");
        setError("");

        startTransition(async () => {
            const data = await login(values);
            setError(data.error);
            setSuccess(data.success);
        });
    }

    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="user@site.com"
                                            type="email"
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="******"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full"
                    >
                        Login
                    </Button>

                </form>
            </Form>
        </CardWrapper>
    );
};