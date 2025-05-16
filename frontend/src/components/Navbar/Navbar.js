"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSeedling } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-green-600 text-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <FontAwesomeIcon icon={faSeedling} size="lg" className="mr-2" />
          <span className="text-xl font-bold">JardinSolidaire</span>
        </Link>

        <div className="flex items-center">
          <div className="hidden md:flex space-x-4 mr-4">
            <Link href="/ajouter-jardin">
              <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">
                J&apos;ai un jardin
              </button>
            </Link>
            <Link href="/je-veux-jardiner">  
              <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">
                Je veux jardiner
              </button>
            </Link>
          </div>
          <div onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer">
            {menuOpen ? (
              <FontAwesomeIcon icon={faTimes} size="lg" />
            ) : (
              <FontAwesomeIcon icon={faBars} size="lg" />
            )}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="bg-green-600 w-full absolute top-16 left-0">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <Link href="/profile" className="block">
                Mon Profil
              </Link>
            </li>
            <li>
              <Link href="/messages" className="block">
                Ma messagerie
              </Link>
            </li>
            <li>
              <Link href="/reservations" className="block">
                Réservations
              </Link>
            </li>
            <li>
              <Link href="/favorites" className="block">
                Mes Favoris
              </Link>
            </li>
            <li>
              <Link href="/logout" className="block">
                Déconnexion
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
