export default function Header() {
    return (
        <div id="header">
            <nav className="fixed w-full z-10 top-0 bg-white" >
                <div id="progress" className="h-1 z-20 top-0" style={{background: 'linear-gradient(to right, #4dc0b5 var(--scroll), transparent 0)'}}></div>

                <div className="w-full md:max-w-4xl mx-auto flex flex-wrap items-center justify-between mt-0 py-3">

                    <div className="pl-4">
                        <a className="text-gray-900 no-underline hover:no-underline font-extrabold text-xl" href="#">
                            Chat
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    );
}
