import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TableHeader = styled.th`
  border: 1px solid black;
  padding: 10px;
  min-width: 100px;
  background: #87CEFA;
`;

const TableData = styled.td`
  border: 1px solid black;
  padding: 10px;
`;

const Select = styled.select`
  width: 100%;
`;

const AddButton = styled.button`
  margin-top: 10px;
  width: 150px;
  padding: 10px;
  border: 2px solid black;
  box-shadow: 2px 3px 5px 0px rgba(0,0,0,0.75);
  outline: none;

  &:hover {
    background: #FF6347;
    cursor: pointer;
  }
`;

const ResetButton = styled.button`
  margin-top: 10px;
  margin-left: 20px;
  width: 150px;
  padding: 10px;
  border: 2px solid black;
  box-shadow: 2px 3px 5px 0px rgba(0,0,0,0.75);
  outline: none;
  
  &:hover {
    background: #FF6347;
    cursor: pointer;
  }
`;

const DeleteRowButton = styled.button`
  width: 100px;
  padding: 7px;
  border: 2px solid black;
  outline: none;
  
  &:hover {
    background: #FF6347;
    cursor: pointer;
  }
`;

const Title = styled.h1`
  font-size: 24px;
`;

export function Workspace() {
  const [tableRows, setTableRows] = useState([]);
  const [percentRowFive, setPercentRowFive] = useState([]);
  const [percentRowEight, setPercentRowEight] = useState([]);
  const [percentRowTwentyThree, setPercentRowTwentyThree] = useState([]);
  
  useEffect(() => {
    const tableRows = JSON.parse(localStorage.getItem('tableRows'));
    const percentRowFive = JSON.parse(localStorage.getItem('percentRowFive'));
    const percentRowEight = JSON.parse(localStorage.getItem('percentRowEight'));
    const percentRowTwentyThree = JSON.parse(localStorage.getItem('percentRowTwentyThree'));
    if (tableRows) setTableRows(tableRows);
    if (percentRowFive) setPercentRowFive(percentRowFive);
    if (percentRowEight) setPercentRowEight(percentRowEight);
    if (percentRowTwentyThree) setPercentRowTwentyThree(percentRowTwentyThree);
  }, []);

  const addRow = () => {
    const row = {
      name: '',
      weight: '',
      brutto: '',
      vatPrice: 1.05,
      vatAmount: 0,
      nettoPrice: 0,
      nettoAmount: 0,
      bruttoAmount: '',
    }
    setTableRows([...tableRows, row]);
    localStorage.setItem('tableRows', JSON.stringify([...tableRows, row]));

  }

  const setPercentageRows = (tableRow) => {
    setPercentRowFive(tableRow.filter(row => Number(row.vatPrice) === 1.05));
    setPercentRowEight(tableRow.filter(row => Number(row.vatPrice) === 1.08));
    setPercentRowTwentyThree(tableRow.filter(row => Number(row.vatPrice) === 1.23));
    localStorage.setItem('percentRowFive', JSON.stringify(tableRow.filter(row => Number(row.vatPrice) === 1.05)));
    localStorage.setItem('percentRowEight', JSON.stringify(tableRow.filter(row => Number(row.vatPrice) === 1.08)));
    localStorage.setItem('percentRowTwentyThree', JSON.stringify(tableRow.filter(row => Number(row.vatPrice) === 1.23)));
  }

  const deleteRow = (index) => {
    const rowsCopy = [...tableRows];
    rowsCopy.splice(index, 1)
    setTableRows([...rowsCopy]);
    setPercentageRows(rowsCopy);
    localStorage.setItem('tableRows', JSON.stringify([...rowsCopy]));
  }

  const handleChange = (e, index) => {
    const newTable = [...tableRows];
    const { name, value } = e.target;
    newTable[index][name] = value.replace(/,/g, '.');;

    const newTableRow = newTable.map(row => {
      if (row.weight && row.brutto && row.vatPrice && row.bruttoAmount) {
        return {
          ...row,
          vatAmount: (Number(row.bruttoAmount) - (Number(row.brutto) / Number(row.vatPrice)) * Number(row.weight)).toFixed(2),
          nettoPrice: (Number(row.brutto) / Number(row.vatPrice)).toFixed(2),
          nettoAmount: ((Number(row.brutto) / Number(row.vatPrice)) * Number(row.weight)).toFixed(2),
        }
      }
      return row;
    })
    setTableRows([...newTableRow]);
    setPercentageRows(newTableRow);
    localStorage.setItem('tableRows', JSON.stringify([...newTableRow]));
  }

  const handleReset = () => {
    setTableRows([]);
    setPercentRowFive([]);
    setPercentRowEight([]);
    setPercentRowTwentyThree([]);
    localStorage.setItem('tableRows', JSON.stringify([]));
    localStorage.setItem('percentRowFive', JSON.stringify([]));
    localStorage.setItem('percentRowEight', JSON.stringify([]));
    localStorage.setItem('percentRowTwentyThree', JSON.stringify([]));
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <TableHeader>Nazwa</TableHeader>
            <TableHeader>Waga</TableHeader>
            <TableHeader>Cena brutto</TableHeader>
            <TableHeader>Stawka VAT</TableHeader>
            <TableHeader>Podatek VAT</TableHeader>
            <TableHeader>Cena netto</TableHeader>
            <TableHeader>Wartość netto</TableHeader>
            <TableHeader>Wartość brutto</TableHeader>
            <TableHeader></TableHeader>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index}>
              <TableData color={row.vatPrice}>
                <input placeholder="wpisz nazwe" autoComplete="off" type="text" name="name" value={row.name} onChange={(e) => handleChange(e, index)} /> 
              </TableData>
              <TableData color={row.vatPrice}>
                <input placeholder="wpisz wage" autoComplete="off" type="number" name="weight" value={row.weight} onChange={(e) => handleChange(e, index)} /> 
              </TableData>
              <TableData color={row.vatPrice}>
              <input placeholder="wpisz cene brutto" autoComplete="off" type="number" name="brutto" value={row.brutto} onChange={(e) => handleChange(e, index)} /> 
              </TableData>
              <TableData color={row.vatPrice}>
                <Select name="vatPrice" value={row.vatPrice} onChange={(e) => handleChange(e, index)}>
                  <option value={1.05}>1,05</option>
                  <option value={1.08}>1,08</option>
                  <option value={1.23}>1,23</option>
                </Select>
              </TableData>
              <TableData color={row.vatPrice}>{row.vatAmount}</TableData>
              <TableData color={row.vatPrice}>{row.nettoPrice}</TableData>
              <TableData color={row.vatPrice}>{row.nettoAmount}</TableData>
              <TableData color={row.vatPrice}>
                <input placeholder="wpisz wartość brutto" autoComplete="off" type="text" name="bruttoAmount" value={row.bruttoAmount} onChange={(e) => handleChange(e, index)} /> 
              </TableData>
              <TableData color={row.vatPrice}>
                <DeleteRowButton type="button" onClick={() => deleteRow(index)}>
                  Usuń
                </DeleteRowButton>
              </TableData>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex' }}>
        <AddButton type="button" onClick={addRow}>
          Dodaj
        </AddButton>
        <ResetButton type="button" onClick={handleReset}>
          Resetuj
        </ResetButton>
      </div>

      <Title>SUMA:</Title>
      <table>
        <thead>
          <tr>
            <TableHeader>Waga</TableHeader>
            <TableHeader>Cena brutto</TableHeader>
            <TableHeader>Stawka VAT</TableHeader>
            <TableHeader>Podatek VAT</TableHeader>
            <TableHeader>Cena netto</TableHeader>
            <TableHeader>Wartość netto</TableHeader>
            <TableHeader>Wartość brutto</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableData>
              {tableRows.length ? tableRows.map(row => Number(row.weight)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {tableRows.length ? tableRows.map(row => Number(row.brutto)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData></TableData>
            <TableData>
              {tableRows.length ? tableRows.map(row => Number(row.vatAmount)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {tableRows.length ? tableRows.map(row => Number(row.nettoPrice)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {tableRows.length ? tableRows.map(row => Number(row.nettoAmount)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {tableRows.length ? tableRows.map(row => Number(row.bruttoAmount)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
          </tr>
        </tbody>
      </table>

      <Title>Suma dla 5%:</Title>
      <table>
        <thead>
          <tr>
            <TableHeader>Waga</TableHeader>
            <TableHeader>Cena brutto</TableHeader>
            <TableHeader>Stawka VAT</TableHeader>
            <TableHeader>Podatek VAT</TableHeader>
            <TableHeader>Cena netto</TableHeader>
            <TableHeader>Wartość netto</TableHeader>
            <TableHeader>Wartość brutto</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableData>
              {percentRowFive.length ? percentRowFive.map(row => Number(row.weight)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {percentRowFive.length ? percentRowFive.map(row => Number(row.brutto)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData></TableData>
            <TableData>
              {percentRowFive.length ? percentRowFive.map(row => Number(row.vatAmount)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {percentRowFive.length ? percentRowFive.map(row => Number(row.nettoPrice)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {percentRowFive.length ? percentRowFive.map(row => Number(row.nettoAmount)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {percentRowFive.length ? percentRowFive.map(row => Number(row.bruttoAmount)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
          </tr>
        </tbody>
      </table>
      <Title>Suma dla 8%</Title>
      <table>
        <thead>
          <tr>
            <TableHeader>Waga</TableHeader>
            <TableHeader>Cena brutto</TableHeader>
            <TableHeader>Stawka VAT</TableHeader>
            <TableHeader>Podatek VAT</TableHeader>
            <TableHeader>Cena netto</TableHeader>
            <TableHeader>Wartość netto</TableHeader>
            <TableHeader>Wartość brutto</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableData>
              {percentRowEight.length ? percentRowEight.map(row => Number(row.weight)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {percentRowEight.length ? percentRowEight.map(row => Number(row.brutto)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData></TableData>
            <TableData>
              {percentRowEight.length ? percentRowEight.map(row => Number(row.vatAmount)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {percentRowEight.length ? percentRowEight.map(row => Number(row.nettoPrice)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {percentRowEight.length ? percentRowEight.map(row => Number(row.nettoAmount)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {percentRowEight.length ? percentRowEight.map(row => Number(row.bruttoAmount)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
          </tr>
        </tbody>
      </table>
      <Title>Suma dla 23%</Title>
      <table>
        <thead>
          <tr>
            <TableHeader>Waga</TableHeader>
            <TableHeader>Cena brutto</TableHeader>
            <TableHeader>Stawka VAT</TableHeader>
            <TableHeader>Podatek VAT</TableHeader>
            <TableHeader>Cena netto</TableHeader>
            <TableHeader>Wartość netto</TableHeader>
            <TableHeader>Wartość brutto</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableData>
              {percentRowTwentyThree.length ? percentRowTwentyThree.map(row => Number(row.weight)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {percentRowTwentyThree.length ? percentRowTwentyThree.map(row => Number(row.brutto)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData></TableData>
            <TableData>
              {percentRowTwentyThree.length ? percentRowTwentyThree.map(row => Number(row.vatAmount)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {percentRowTwentyThree.length ? percentRowTwentyThree.map(row => Number(row.nettoPrice)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {percentRowTwentyThree.length ? percentRowTwentyThree.map(row => Number(row.nettoAmount)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
            <TableData>
              {percentRowTwentyThree.length ? percentRowTwentyThree.map(row => Number(row.bruttoAmount)).reduce((total, num) => total + num).toFixed(2) : 0}
            </TableData>
          </tr>
        </tbody>
      </table>
    </div>
  )
}