import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { Box, Flex } from 'rebass'
import { useTransition, animated, config } from 'react-spring'

type Props = {
    showModal: any
    setShowModal: any
}

const Modal: React.FC<Props> = ({ children, showModal, setShowModal }) => {
    const backdropEl = useRef(null)

    const transitions = useTransition(showModal, null, {
        config: config.default,
        from: { opacity: 0, transform: 'scale(0) translate3d(0,-540px,0)' },
        enter: { opacity: 1, transform: 'scale(1) translate3d(0,0px,0)' },
        leave: { opacity: 0, transform: 'scale(0) translate3d(0,-540px,0)' },
    })

    return ReactDOM.createPortal(
        <React.Fragment>
            {transitions.map(
                ({ item, key, props }) =>
                    item && (
                        <animated.div
                            key={key}
                            style={{
                                opacity: props.opacity,
                                transform: props.transform,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            }}
                        >
                            <Flex
                                ref={backdropEl}
                                onClick={e => {
                                    if (e.target === backdropEl.current)
                                        setShowModal(false)
                                }}
                                alignItems={'center'}
                                bg={'tranperent'}
                                sx={{
                                    overflow: 'hidden',
                                    width: '100vw',
                                    height: '100vh',
                                    // zIndex: 1000,
                                }}
                            >
                                <Box
                                    marginX={'auto'}
                                    maxHeight={'90vh'}
                                    overflow={'auto'}
                                    padding={'2rem'}
                                    sx={{
                                        bg: 'background',
                                        boxShadow: 'heavy',
                                        borderRadius: 10,
                                    }}
                                >
                                    {children}
                                </Box>
                            </Flex>
                        </animated.div>
                    )
            )}
        </React.Fragment>,
        document.body
    )
}

export default Modal
