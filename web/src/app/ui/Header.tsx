import ProfileServer from "./Profile";

export default function Header() {


    return (
        <div id="header">
            <nav className="fixed w-full z-10 top-0 bg-white" >

                <div className="w-full flex flex-wrap items-center justify-between mt-0 py-3 px-4">

                    <div className="pr-4">
                        <a className="text-gray-900 no-underline hover:no-underline font-extrabold text-xl" href="/">
                            Kazkazi Chat
                        </a>
                    </div>
                    <ProfileServer></ProfileServer>                    
                </div>
            </nav>
        </div>
    );
}
