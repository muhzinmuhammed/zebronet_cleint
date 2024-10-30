import { Disclosure, Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

const navigation = [
   {
    name:'Supplier',
    href:'/'
   }
   
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function NavBar() {
    const navigate = useNavigate();
    const userToken = localStorage.getItem('userToken');
    const userName = JSON.parse(localStorage.getItem('userName'));

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="h-8 w-auto"
                                        src="https://media.licdn.com/dms/image/v2/D560BAQHY67lmgwmhXw/company-logo_200_200/company-logo_200_200/0/1709031437058/nearpay_innovations_logo?e=1738195200&v=beta&t=9Zy86pLo2cWly_wLCwvS96QF1a8FaK2la7JIx4sfLg8"
                                        alt="Your Company"
                                    />
                                </div>
                                {userToken && (
                                    <div className="hidden sm:ml-6 sm:block">
                                        <div className="flex space-x-4">
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-900 text-white'
                                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'rounded-md px-3 py-2 text-sm font-medium'
                                                    )}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <div className="flex items-center gap-x-4">
                                                {!userToken ? (
                                                    <>
                                                        <Link to="/register">
                                                            <button className="text-white px-3 py-2 rounded-md text-sm font-medium">
                                                                Register
                                                            </button>
                                                        </Link>
                                                        <Link to="/login">
                                                            <button className="text-white px-3 py-2 rounded-md text-sm font-medium">
                                                                Login
                                                            </button>
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h5 className="text-white">{userName}</h5>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="text-white px-3 py-2 rounded-md text-sm font-medium"
                                                        >
                                                            Logout
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </Menu.Button>
                                    </div>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    <Disclosure.Panel className="sm:hidden">
                        {userToken && (
                            <div className="space-y-1 px-2 pb-3 pt-2">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as={Link}
                                        to={item.href}
                                        className={classNames(
                                            item.current
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block rounded-md px-3 py-2 text-base font-medium'
                                        )}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        )}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}