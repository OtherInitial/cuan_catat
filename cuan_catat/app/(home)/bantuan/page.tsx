"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Anda mungkin perlu ini
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// 1. Definisikan skema validasi
const formSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

type FormValues = z.infer<typeof formSchema>;

export default function BantuanPage() {
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", email: "", message: "" }
    });

    // 2. Fungsi untuk mengirim pesan
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsSending(true);
        try {
            const response = await fetch("/api/contact", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Gagal mengirim pesan");

            toast.success(result.message);
            setIsSent(true); // Tampilkan pesan sukses
            form.reset();

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-12">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Pusat Bantuan</CardTitle>
                    <CardDescription>
                        Ada pertanyaan atau keluhan? Kirimkan pesan kepada kami. 
                        Kami akan membalasnya langsung ke email Anda.
                    </CardDescription>
                </CardHeader>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                            {isSent ? (
                                <div className="p-4 text-center bg-green-50 border border-green-200 rounded-md">
                                    <h3 className="font-medium text-green-700">Pesan Terkirim!</h3>
                                    <p className="text-sm text-green-600 mt-1">
                                        Terima kasih telah menghubungi kami. Silakan periksa email Anda 
                                        (termasuk folder spam) untuk balasan dari kami.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nama Anda</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Nama lengkap Anda" />
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
                                                <FormLabel>Email Anda (untuk balasan)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="email" placeholder="email@anda.com" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Pesan Anda</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Tuliskan pesan Anda di sini..."
                                                        rows={5}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
_                                </>
                            )}
                        </CardContent>
                        
                        {!isSent && (
                            <CardFooter>
                                <Button type="submit" className="w-full" disabled={isSending}>
                                    {isSending ? (
                                        <Loader2 className="animate-spin mr-2" />
                                    ) : (
                                        <Send className="h-4 w-4 mr-2" />
                                    )}
                                    Kirim Pesan
                                </Button>
                            </CardFooter>
                        )}
                    </form>
                </Form>
            </Card>
        </div>
    );
}