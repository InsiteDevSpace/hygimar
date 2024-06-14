import React from 'react';
import { useStock } from 'contexts/stock/StockContext';
import MainCard from 'components/MainCard';
import StockForm from 'components/stock/StockForm';

const AddStock = () => {
  const { addStock } = useStock();

  return (
    <MainCard title="Add Stock">
      <StockForm onSubmit={addStock} />
    </MainCard>
  );
};

export default AddStock;
