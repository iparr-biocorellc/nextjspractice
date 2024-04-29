import AcmeLogo from '@/app/ui/acme-logo';
import SignupForm from '@/app/ui/SignupForm';
import Image from 'next/image';
export default function signupPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
                    <div className="w-32 text-white md:w-36">
                        <Image
                src="/flipside.png"
                width={225}
                height={145}
                className="hidden md:block"
                alt="Screenshots of the dashboard project showing desktop version"
            />
          {}
                    </div>
                </div>
                <SignupForm/>

            </div>
        </main>
    );
};