import React from 'react';
import { TypeAnimation } from 'react-type-animation';

interface ChatHeaderProps {
  usersInRoom: string[];
}

export function ChatHeader({ usersInRoom }: ChatHeaderProps) {
  const getTypeAnimationSequence = () => {
    if (usersInRoom.length === 2) {
      return [`Atenção jogadores ${usersInRoom[0]} e ${usersInRoom[1]}, adicionem as imagens clicando no botão abaixo`, 1000];
    }
    return [`Atenção jogadores, adicionem as imagens clicando no botão abaixo`, 1000];
  };

  return (
    <>
      {usersInRoom.length === 2 ? (
        <TypeAnimation
          sequence={getTypeAnimationSequence()}
          wrapper="span"
          speed={40}
          repeat={0}
          className="text-5xl max-w-4xl"
        />
      ) : (
        <div className="text-5xl max-w-3xl">Carregando os usuários...</div>
      )}
    </>
  );
}
