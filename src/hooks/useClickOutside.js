import { useEffect } from "react";

const isParentOrSame = (el, parent) =>
  el && (el === parent || isParentOrSame(el.parentElement, parent));

const useClickOutside = (ref, onClickOutside) => {
  useEffect(() => {
    const onClick = (event) => {
      if (!isParentOrSame(event.target, ref.current)) {
        onClickOutside(event);
      }
    };

    window.addEventListener("mouseup", onClick);
    return () => {
      window.removeEventListener("mouseup", onClick);
    };
  }, [ref, onClickOutside]);
};

export default useClickOutside;
