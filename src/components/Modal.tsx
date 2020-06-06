import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { Box, Flex } from 'rebass'
import { useSpring, animated } from 'react-spring'

type Props = {
    showModal: any
    setShowModal: any
}

const Modal: React.FC<Props> = ({ children, showModal, setShowModal }) => {
    const backdropEl = useRef(null)

    const props = useSpring({ transform: showModal ? 'scale(1)' : 'scale(0)' })

    return ReactDOM.createPortal(
        <React.Fragment>
            {showModal && (
                <Flex
                    ref={backdropEl}
                    onClick={e => {
                        if (e.target === backdropEl.current) setShowModal(false)
                    }}
                    alignItems={'center'}
                    bg={'#00000040'}
                    sx={{
                        overflow: 'hidden',
                        width: '100vw',
                        height: '100vh',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1000,
                    }}
                >
                    <Box
                        marginX={[3, 'auto']}
                        bg={'background'}
                        maxHeight={'90vh'}
                        overflow={'auto'}
                        padding={'2rem'}
                        sx={{ boxShadow: 'card', borderRadius: 'default' }}
                    >
                        <animated.div style={props}>{children}</animated.div>
                    </Box>
                </Flex>
            )}
        </React.Fragment>,
        document.body
    )
}

export default Modal
