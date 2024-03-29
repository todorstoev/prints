import React from 'react';
import { useDispatch } from 'react-redux';
import { Flex, Button } from 'rebass';
import { Edit2, Save, LogOut, Trash2 } from 'react-feather';
import { config, useTransition, animated } from 'react-spring';

import { actions } from '../shared/store';

import { useConfirm } from '../shared/hooks/useConfirm';
import Modal from './Modal';

type Props = {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  sbmBtnTrRef: any;
};

export const UserControl: React.FC<Props> = ({ edit, setEdit, sbmBtnTrRef }) => {
  const dispatch = useDispatch();

  const { isOpen, setIsOpen, Confirm } = useConfirm(
    () => dispatch(actions.deleteUserRequest()),
    'You are about to delete your account ,\n do you want to continue ?',
  );

  const transitions = useTransition(edit, null, {
    config: config.stiff,
    ref: sbmBtnTrRef,

    trail: 100,
    from: { opacity: 0, transform: 'scale(0)', left: 70 },
    enter: { opacity: 1, transform: 'scale(1)', left: 0 },
    leave: { opacity: 0, transform: 'scale(0)', left: 70 },
  });

  return (
    <>
      <Flex
        backgroundColor={edit ? 'gray' : 'primary'}
        color={'background'}
        p={'.3em'}
        onClick={(e) => {
          e.preventDefault();
          setEdit(!edit);
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
        <Edit2 size={18} />
      </Flex>

      <Flex
        backgroundColor={'background'}
        color={'primary'}
        p={'.3em'}
        onClick={(e) => {
          e.preventDefault();
          dispatch(actions.requestLogout());
        }}
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          borderRadius: 360,
          boxShadow: 'small',
          transition: 'all 0.2s linear',
          ':hover': {
            cursor: 'pointer',
            filter: 'brightness(110%)',
          },
        }}
      >
        <LogOut size={18} />
      </Flex>

      <Flex
        backgroundColor={'error'}
        color={'background'}
        p={'.3em'}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          borderRadius: 360,
          boxShadow: 'small',
          transition: 'all 0.2s linear',
          ':hover': {
            cursor: 'pointer',
            filter: 'brightness(110%)',
          },
        }}
      >
        <Trash2 size={18} />
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
                  <Save size={18} />
                </Flex>
              </Button>
            </animated.div>
          ),
      )}

      <Modal {...{ showModal: isOpen, setShowModal: setIsOpen }}>
        <Confirm></Confirm>
      </Modal>
    </>
  );
};
