"use client";

import React, { useState } from "react";
import Modal from "../components/Modal";
import { useModal } from "../components/ModalUse";

const ModalPage = () => {
  // useModal component contains modal functionality
  const { modalIsOpen, toggleModal, handleCloseModal, closeModals } =
    useModal();

  return (
    <div>
      <button onClick={() => toggleModal("modal-1")}>Open Modal 1</button>
      <button onClick={() => toggleModal("modal-2")}>Open Modal 2</button>

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
    </div>
  );
};

export default ModalPage;
