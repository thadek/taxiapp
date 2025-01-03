
import Link from 'next/link';
import localFont from 'next/font/local'

const myFont = localFont({ src: '../../app/fonts/Speeday-Bold-FFP.ttf' });

const Logo = ({text="TaxiApp"}:{text:string}) => {
    return (
        <Link className=" font-bold leading-none" href="/">
            <h1 className={`font-bold text-3xl dark:text-white text-gray-800 ${myFont.className} `}>{text}</h1>
        </Link>
    );
}

export { Logo};