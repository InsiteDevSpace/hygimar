import React from 'react';
import { useSupplier } from 'contexts/supplier/SupplierContext';
import MainCard from 'components/MainCard';
import SupplierForm from 'components/supplier/SupplierForm';

const AddSupplier = () => {
  const { addSupplier } = useSupplier();

  return (
    <MainCard title="Add Supplier">
      <SupplierForm onSubmit={addSupplier} />
    </MainCard>
  );
};

export default AddSupplier;
