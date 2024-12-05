import { ButtonWithPromise } from '@components/ui/ButtonWithPromise';
import { CardContent } from '@components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { paths } from '@configs';
import { zodResolver } from '@hookform/resolvers/zod';
import APIService from '@services/APIService';
import { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { z } from 'zod';

interface iLoginScreen {}

const formSchema = z.object({
    handle: z.string().min(1),
    password: z.string().min(1),
});

const LoginScreen: FC<iLoginScreen> = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            handle: '',
            password: '',
        },
    });
    const navigate = useNavigate();

    const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
        try {
            await APIService.login(values.handle, values.password);
            toast.success('Login successful');
            navigate(paths.index);
            // Handle successful login (e.g., redirect to dashboard)
        } catch (e) {
            toast.error('Failed to login');
        }
    }, []);

    return (
        <CardContent className="pt-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="handle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your username" {...field} />
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
                                    <Input type="password" placeholder="Enter your password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ButtonWithPromise onClickAsync={form.handleSubmit(onSubmit)} type="submit">
                        Login
                    </ButtonWithPromise>
                </form>
            </Form>
        </CardContent>
    );
};

export default LoginScreen;
