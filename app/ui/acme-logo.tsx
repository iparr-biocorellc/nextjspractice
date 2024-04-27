import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';



export default function AcmeLogo() {
  return (
    <div className={`${lusitana.className} flex flex-row items-center leading-none text-white`}>
      {/* Replace the icon with an img tag referencing your logo */}
      <Image
          src="/logo.png"
          width={100}
          height={100}
          className="h-20 w-40"
          alt="Acme Logo"
      />
    </div>
  );
}
