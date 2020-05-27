import React, { useRef } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect, ConnectedProps } from 'react-redux'
import { Box, Image } from 'rebass'
import { animated as a, useSpring, config } from 'react-spring'

import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Devices from './pages/Devices'
import Profile from './pages/Profile'

import { RootState } from './types'
import { NoMatch } from './pages/404'

import NavBar from './components/NavBar'
import { useDrag } from 'react-use-gesture'

const mapState = (state: RootState) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isVerifying: state.auth.isVerifying,
        user: state.auth.user,
    }
}

const connector = connect(mapState)

type PropsFromRedux = ConnectedProps<typeof connector>

const width = 400

const App: React.FC<PropsFromRedux> = ({
    isAuthenticated,
    isVerifying,
    user,
}) => {
    const draggingRef = useRef(false)

    const [{ x }, set] = useSpring(() => ({ x: width }))

    const open = ({ canceled }: any) => {
        set({ x: 0, config: canceled ? config.wobbly : config.stiff })
    }

    const close = (velocity = 0) => {
        set({ x: width, config: { ...config.stiff, velocity } })
    }

    const bind = useDrag(
        ({ first, last, vxvy: [vx], movement: [mx], cancel, canceled }) => {
            if (first) draggingRef.current = true
            // if this is not the first or last frame, it's a moving frame
            // then it means the user is dragging
            else if (last) draggingRef.current = false

            // if the user drags up passed a threshold, then we cancel
            // the drag so that the sheet resets to its open position
            if (mx < -70) cancel && cancel()

            // when the user releases the sheet, we check whether it passed
            // the threshold for it to close, or if we reset it to its open positino
            if (last)
                mx > width * 0.75 || vx > 0.5 ? close(vx) : open({ canceled })
            // when the user keeps dragging, we just move the sheet according to
            // the cursor position
            else set({ x: mx, immediate: false, config: config.stiff })
        },
        { initial: () => [0, x.get()], bounds: { top: 0 }, rubberband: true }
    )

    const bgStyle = {
        transform: x.to(
            [0, width],
            ['translateX(-8%) scale(1.16)', 'translateY(0px) scale(1)']
        ),
        opacity: x.to([0, width], [0.4, 1], 'clamp'),
        touchAction: x.to(v => (v > 0 ? 'auto' : 'none')),
    }

    const display = x.to(py => (py < width ? 'block' : 'none'))

    return (
        <Box className="App" height={'100%'} style={{ overflow: 'hidden' }}>
            <Box
                onClick={open}
                bg={'primary'}
                sx={{
                    position: 'fixed',
                    zIndex: 450,
                    bottom: 50,
                    right: 50,
                    boxShadow: 'heavy',

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}
                variant={'avatar'}
            >
                <a.div
                    style={{
                        display: x.to(v => (v > 0 ? 'block' : 'none')),
                        background: '#fff',
                        height: '20%',
                        width: '20%',
                        borderRadius: '50%',
                    }}
                ></a.div>
                <a.div
                    style={{
                        display: x.to(v => (v > 0 ? 'none' : 'block')),
                        transform: x.to(
                            [0, width],
                            [
                                'rotateY(180deg) scale(1)',
                                'rotateY(0deg) scale(0)',
                            ]
                        ),
                    }}
                >
                    <Image
                        src={user.pic}
                        alt=""
                        variant={'avatar'}
                        bg={'whitesmoke'}
                        sx={{ position: 'relative', bottom: 0 }}
                    />
                </a.div>
            </Box>

            <a.div style={bgStyle} onClick={() => close()}>
                <Switch>
                    <ProtectedRoute
                        exact
                        path="/"
                        component={Home}
                        isAuthenticated={isAuthenticated}
                        isVerifying={isVerifying}
                    />
                    <Route path="/login" component={Login} />
                    <ProtectedRoute
                        exact
                        path="/devices"
                        component={Devices}
                        isAuthenticated={isAuthenticated}
                        isVerifying={isVerifying}
                    />
                    <ProtectedRoute
                        exact
                        path="/profile"
                        component={Profile}
                        isAuthenticated={isAuthenticated}
                        isVerifying={isVerifying}
                    />
                    <Route component={NoMatch} />
                </Switch>
            </a.div>
            <a.div
                {...bind()}
                style={{
                    top: 0,
                    right: -20,
                    position: 'fixed',
                    display,
                    height: '100%',
                    x,
                }}
            >
                <NavBar close={close} />
            </a.div>
        </Box>
    )
}

export default connector(App)
