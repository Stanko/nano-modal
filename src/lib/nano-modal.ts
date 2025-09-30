const html = document.documentElement;

let scrollPosition = 0;

// ----- PUBLIC API ----- //

export const init = () => {
  const openTriggers = document.querySelectorAll<HTMLElement>(
    "[data-nm-open]:not([data-nm-init])",
  );
  const closeTriggers = document.querySelectorAll<HTMLElement>(
    "[data-nm-close]:not([data-nm-init])",
  );

  openTriggers.forEach((trigger) => {
    trigger.addEventListener("click", handleOpenClick);
    trigger.dataset.nmInit = "true";
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", close);
    trigger.dataset.nmInit = "true";
  });
};

export const open = (modal: HTMLDialogElement) => {
  return new Promise<HTMLDialogElement>((resolve) => {
    if (!modal || modal.open) {
      return;
    }

    const openModal = getOpenModal();

    // Grab the scroll position and scroll bar width before showing the modal
    const scrollBarWidth = window.innerWidth - html.clientWidth;
    const scrollY = window.scrollY;

    // Show the native dialog as modal
    modal.showModal();
    resolve(modal);

    if (openModal) {
      // If there was a modal already open, close it
      // But keep the current scroll position to restore it later
      closeModal(openModal);
    } else {
      // If there is no open modal, lock the scroll and save the scroll position
      html.style.setProperty("--nm-scrollbar-width", `${scrollBarWidth}px`);
      html.style.setProperty("--nm-negative-margin", `${-scrollY}px`);
      scrollPosition = scrollY;
    }

    modal.addEventListener("keydown", handleKeyDown);
    modal.addEventListener("click", handleBackdropClick);
  });
};

export const close = () => {
  return new Promise<HTMLDialogElement>((resolve) => {
    const modal = getOpenModal();

    // No open modal
    if (!modal) {
      return;
    }

    // Modal already closing
    if (modal.classList.contains("nano-modal--closing")) {
      return;
    }

    // Check for the transition duration
    // Per the specification:
    // The time in seconds serialized as per <number> followed by the literal string "s".
    // https://www.w3.org/TR/cssom-1/#ref-for-time-value
    const duration = parseFloat(getComputedStyle(modal).transitionDuration);

    // Method that closes the modal, resets the body scroll and cleans up
    const onClose = () => {
      closeModal(modal);

      // These are not in the cleanup method on purpose,
      // because cleanup is also used when a modal is opened from another modal
      // and in that case we need to keep the same scroll position
      html.style.removeProperty("--nm-negative-margin");
      html.style.removeProperty("--nm-scrollbar-width");
      window.scrollTo(0, scrollPosition);

      resolve(modal);
    };

    // If there is no transition set, close the modal immediately
    if (duration === 0) {
      onClose();
    } else {
      // Wait for the transition to complete before closing the modal
      modal.addEventListener("transitionend", onClose, { once: true });
      modal.classList.add("nano-modal--closing");
    }
  });
};

// ----- PRIVATE HELPERS ----- //

const closeModal = (modal: HTMLDialogElement) => {
  modal.close();

  modal.classList.remove("nano-modal--closing");
  modal.removeEventListener("click", handleBackdropClick);
  modal.removeEventListener("keydown", handleKeyDown);
};

const getOpenModal = (): HTMLDialogElement | null => {
  return document.querySelector(
    ".nano-modal[open]",
  ) as HTMLDialogElement | null;
};

const handleOpenClick = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const id = target.dataset.nmOpen as string;
  const modal = document.getElementById(id) as HTMLDialogElement;

  open(modal);
};

const handleBackdropClick = (event: MouseEvent) => {
  const modal = getOpenModal();

  if (event.target === modal) {
    close();
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    event.preventDefault();
    close();
  }
};
