import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'

import styled from '@emotion/styled'

import { SpringConfig, useTransition, animated } from 'react-spring'
import { X } from 'react-feather'
import { NotificationState, RootState } from '../types'
import { actions } from '../shared/store'

type Props = {
    config?: SpringConfig
    timeout?: number
}

export const NotificationsHub: React.FC<Props> = ({
    config = { tension: 125, friction: 20, precision: 0.1 },
    timeout = 3000,
}: any) => {
    const [refMap] = useState(() => new WeakMap())

    const [cancelMap] = useState(() => new WeakMap())

    const { items } = useSelector<RootState, NotificationState>(
        state => state.notifications
    )

    const dispatch = useDispatch()

    const transitions = useTransition(items, item => item.key, {
        from: { opacity: 0, height: 0, life: '100%' },
        enter: (item: any) => async (next: any) =>
            await next({
                opacity: 1,
                height: refMap.get(item) ? refMap.get(item).offsetHeight : 0,
            }),
        leave: (item: any) => async (next: any, cancel: any) => {
            cancelMap.set(item, cancel)
            await next({ life: '0%' })
            await next({ opacity: 0 })
            await next({ height: 0 })
        },
        onRest: (item: any) => {
            dispatch(actions.removeNotification(item.key))
        },
        config: (_item: any, state: any) =>
            state === 'leave'
                ? [{ duration: timeout }, config, config]
                : config,
    } as any)

    return ReactDOM.createPortal(
        <Container>
            {transitions.map(
                ({ key, item, props: { life, ...style } }: any) => (
                    <Message key={key} style={style}>
                        <Content ref={ref => ref && refMap.set(item, ref)}>
                            <Life style={{ right: life }} />
                            <p>{item.msg}</p>
                            <Button
                                onClick={e => {
                                    e.stopPropagation()
                                    cancelMap.has(item) && cancelMap.get(item)()
                                }}
                            >
                                <X size={18} />
                            </Button>
                        </Content>
                    </Message>
                )
            )}
        </Container>,
        document.body
    )
}

export const Container = styled('div')`
    position: fixed;
    z-index: 1000;
    width: 0 auto;
    top: ${(props: any) => (props.top ? '30px' : 'unset')};
    bottom: ${(props: any) => (props.top ? 'unset' : '30px')};
    margin: 0 auto;
    left: 30px;
    right: 30px;
    display: flex;
    flex-direction: ${props => (props.top ? 'column-reverse' : 'column')};
    pointer-events: none;
    align-items: ${props =>
        props.position === 'center'
            ? 'center'
            : `flex-${props.position || 'end'}`};
    @media (max-width: 680px) {
        align-items: center;
    }
`

export const Message = styled(animated.div)`
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    width: 40ch;
    @media (max-width: 680px) {
        width: 100%;
    }
`

export const Content = styled('div')`
    color: white;
    background: #445159;
    opacity: 0.9;
    padding: 12px 22px;
    font-size: 1em;
    display: grid;
    grid-template-columns: ${(props: any) =>
        props.canClose === false ? '1fr' : '1fr auto'};
    grid-gap: 10px;
    overflow: hidden;
    height: auto;
    border-radius: 3px;
    margin-top: ${props => (props.top ? '0' : '10px')};
    margin-bottom: ${props => (props.top ? '10px' : '0')};
`

export const Button = styled('button')`
    cursor: pointer;
    pointer-events: all;
    outline: 0;
    border: none;
    background: transparent;
    display: flex;
    align-self: flex-end;
    overflow: hidden;
    margin: 0;
    padding: 0;
    padding-bottom: 14px;
    color: rgba(255, 255, 255, 0.5);
    :hover {
        color: rgba(255, 255, 255, 0.6);
    }
`

export const Life = styled(animated.div)`
    position: absolute;
    bottom: ${(props: any) => (props.top ? '10px' : '0')};
    left: 0px;
    width: auto;
    background-image: linear-gradient(130deg, #0b5082, #68c1e9);
    height: 5px;
`
