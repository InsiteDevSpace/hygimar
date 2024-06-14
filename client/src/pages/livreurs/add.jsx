import React from 'react';
import { useLivreur } from 'contexts/livreur/LivreurContext';
import MainCard from 'components/MainCard';
import LivreurForm from 'components/livreur/LivreurForm';

const AddLivreur = () => {
  const { addLivreur } = useLivreur();

  return (
    <MainCard title="Add Livreur">
      <LivreurForm onSubmit={addLivreur} />
    </MainCard>
  );
};

export default AddLivreur;
