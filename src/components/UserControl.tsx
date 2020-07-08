import React from 'react'
import { Flex, Button } from 'rebass'
import { MdModeEdit, MdSave } from 'react-icons/md'
import { config, useTransition, animated } from 'react-spring'

type Props = {
    edit: boolean
    setEdit: (edit: boolean) => void
    sbmBtnTrRef: any
}

export const UserControl: React.FC<Props> = ({
    edit,
    setEdit,
    sbmBtnTrRef,
}) => {
    const transitions = useTransition(edit, null, {
        config: config.stiff,
        ref: sbmBtnTrRef,

        trail: 100,
        from: { opacity: 0, transform: 'scale(0)', left: 70 },
        enter: { opacity: 1, transform: 'scale(1)', left: 0 },
        leave: { opacity: 0, transform: 'scale(0)', left: 70 },
    })

    return (
        <>
            <Flex
                backgroundColor={edit ? 'gray' : 'primary'}
                color={'background'}
                p={'.3em'}
                onClick={e => {
                    e.preventDefault()
                    setEdit(!edit)
                }}
                sx={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    borderRadius: 360,
                    boxShadow: 'small',
                    transition: 'all 0.2s linear',
                    ':hover': {
                        cursor: 'pointer',
                        filter: 'brightness(110%)',
                    },
                }}
            >
                <MdModeEdit size={'1.2em'}></MdModeEdit>
            </Flex>

            {transitions.map(
                ({ item, key, props }) =>
                    item && (
                        <animated.div
                            key={key}
                            style={{
                                opacity: props.opacity,
                                transform: props.transform,
                                position: 'absolute',
                                left: props.left,
                                bottom: 0,
                                borderRadius: 360,
                                borderCollapse: 'separate',
                                overflow: 'hidden',
                                boxShadow: 'small',
                            }}
                        >
                            <Button variant={'clear'} type="submit">
                                <Flex
                                    backgroundColor="#77dd77"
                                    color={'background'}
                                    // fontSize="1.2em"
                                    p={'.3em'}
                                >
                                    <MdSave size={'1.2em'} />
                                </Flex>
                            </Button>
                        </animated.div>
                    )
            )}
        </>
    )
}
