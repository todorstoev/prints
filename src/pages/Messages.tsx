import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps, useStore } from 'react-redux'
import { Observable } from 'rxjs'
import { ChatData, RootState } from '../types'
import { getUserChats } from '../shared/services'

const mapState = (state: RootState) => {
    return {
        user: state.auth.user,
        isAuthenticated: state.auth.isAuthenticated,
        isVerifying: state.auth.isVerifying,
    }
}

const connector = connect(mapState)

type PropsFromRedux = ConnectedProps<typeof connector>

const MessagesHub: React.FC<PropsFromRedux> = ({ user }) => {
    const [userChats, setUserChats] = useState<ChatData[]>([])

    const store = useStore<RootState>()

    useEffect(() => {
        const observable: Observable<ChatData[]> = getUserChats(user)

        const subscription = observable.subscribe({
            next: res => {
                setUserChats(res)
            },
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [user])

    return <div>Hello</div>
}

export default connector(MessagesHub)
