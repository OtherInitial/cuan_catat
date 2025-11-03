import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const myEmail = process.env.MY_PERSONAL_EMAIL; // Email Anda dari .env

export async function POST(req: NextRequest) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return new NextResponse(JSON.stringify({ message: "Semua field wajib diisi" }), { status: 400 });
        }
        
        if (!myEmail) {
            console.error("MY_PERSONAL_EMAIL belum diatur di .env");
            return new NextResponse(JSON.stringify({ message: "Konfigurasi server error" }), { status: 500 });
        }

        // Kirim email ke DIRI ANDA SENDIRI
        await resend.emails.send({
            from: 'noreply@domain-anda.com',
            to: myEmail, 
            subject: `Pesan Bantuan Baru dari: ${name} (Cuan Catat)`,
            replyTo: email, 
            
            // Isi email yang akan Anda terima
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Pesan Bantuan Baru</h2>
                    <p>Anda menerima pesan baru dari formulir bantuan Cuan Catat.</p>
                    <hr>
                    <p><strong>Nama Pengirim:</strong> ${name}</p>
                    <p><strong>Email Pengirim:</strong> ${email}</p>
                    <h3>Pesan:</h3>
                    <p style="white-space: pre-wrap; background-color: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</p>
                </div>
            `
        });

        return new NextResponse(JSON.stringify({ message: "Pesan Anda berhasil terkirim!" }), { status: 200 });

    } catch (error) {
        console.error("Contact API Error:", error);
        return new NextResponse(JSON.stringify({ message: "Gagal mengirim pesan" }), { status: 500 });
    }
}