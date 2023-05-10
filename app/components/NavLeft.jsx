/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Modal from "../components/Modal";
import { useModal } from "./ModalUse";
import placeholderImage from "../../public/placeholder.png";

const NavLeft = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { modalIsOpen, toggleModal, handleCloseModal, closeModals } =
    useModal();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  const pathname = usePathname();
  return (
    <>
      <nav className="nav-left">
        <ul>
          <li className="nav-left-logo">
            <Link href="/">
              <Image src={placeholderImage} alt="" height={100} width={40} />
            </Link>
          </li>

          <li>
            <Link href="/join">1. Join</Link>
          </li>
          <li>
            <Link href="/profile/create">2. Create Profile</Link>
          </li>

          <li>
            <Link href="/profile">3. Profile (Welcome)</Link>
          </li>

          <li>
            <Link href="/profile/edit/">4. Edit Profile</Link>
          </li>

          <li>
            <Link href="/profile/sort/">Sort</Link>
          </li>

          <li>
            <Link href="/profile/gallery/">Gallery</Link>
          </li>

          <li className={pathname == "/" ? "active-nav-left" : ""}>
            <Link href="/">
              <span>
                {pathname === "/" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                )}
              </span>
              <span>Home</span>
            </Link>
          </li>
          <li className={pathname == "/list" ? "active-nav-left" : ""}>
            <Link href="/list">
              <span>
                {pathname === "/list" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                )}
              </span>
              <span>List</span>
            </Link>
          </li>
          <li className={pathname == "/saved" ? "active-nav-left" : ""}>
            <Link href="/saved">
              <span>
                {pathname === "/saved" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                )}
              </span>
              <span>Favorites</span>
            </Link>
          </li>

          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>

          <li onClick={() => toggleModal("modal-1")}>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <span>More</span>
          </li>
          <Modal
            isOpen={modalIsOpen["modal-1"]}
            handleCloseModal={() => handleCloseModal("modal-1")}
          >
            <h2>Modal 1</h2>
            <p>Modal 1 contents go here.</p>
            <button onClick={() => toggleModal("modal-3")}>Open Modal 3</button>
          </Modal>

          <Modal
            isOpen={modalIsOpen["modal-2"]}
            handleCloseModal={() => handleCloseModal("modal-2")}
          >
            <h2>Modal 2</h2>
            <p>Modal 2 contents go here.</p>
          </Modal>

          <Modal
            isOpen={modalIsOpen["modal-3"]}
            handleCloseModal={() => handleCloseModal("modal-3")}
          >
            <h2>Modal 3</h2>
            <p>Modal 3 contents go here.</p>

            <button onClick={() => closeModals(["modal-1", "modal-3"])}>
              Close Modals 1 and 3
            </button>
          </Modal>
        </ul>
      </nav>
    </>
  );
};

export default NavLeft;
