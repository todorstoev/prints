import React, { ComponentClass } from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'

interface ProtectedRouteProps extends RouteProps {
    component: ComponentClass | any
    isAuthenticated: boolean
    isVerifying: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    component: Component,
    isAuthenticated,
    isVerifying,
    ...rest
}: ProtectedRouteProps) => {
    return (
        <Route
            {...rest}
            render={props =>
                isVerifying ? (
                    <div />
                ) : isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    )
}

export default ProtectedRoute
