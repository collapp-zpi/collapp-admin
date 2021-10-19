import React from 'react'

const Modal = ({
  visible,
  hide,
  children,
}: {
  visible: boolean
  hide: (visible: boolean) => void
  children: JSX.Element
}) => {
  if (!visible) {
    return null
  }

  return <div onClick={() => hide(false)}>{children}</div>
}

export default Modal
